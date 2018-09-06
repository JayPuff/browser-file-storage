import MESSAGES from './messages'
import MIMETYPES from './mimetypes'
import LOGGER from './logger'
import FileAbstraction from './file';

const EMPTY_FUNC = () => {}
let SELF = null

// *************************** //
// **** CLASS DECLARATION **** //
// *************************** //

class BrowserFileStorage {
    constructor () {
        this._init = false
        this._idb  = null
        this._db   = null
        this._namespace = null
        this._idb_name = "BROWSER_FILE_STORAGE_JS",
        this._idb_version = 3,

        this._idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"} // This line should only be needed if it is needed to support the object's constants for older browsers
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    }

    // Set log level for browserFileStorage
    // 'none', 'error', 'warn', 'info' 
    logLevel (level) {
        LOGGER.logLevel(level)
    }

    // Init opens the inner IndexedDB database
    // By giving it a namespace, we make a different 'Instance' of the database.
    // Adds safety against this same library being used in more than one place within the same domain. (Just in case a library you include also includes this...)
    // namespace can just be the name of your app
    /**
     * Opens the inner database. 
     * @param {string} [namespace] - Identify the inner database instance by appending your namespace. It could be your app's name.
     * @returns {Promise} - Returns a Promise which resolves if the inner database is initialized properly. 
     */
    init (namespace) {
        return new Promise((resolve, reject) => {
            if(SELF._init) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_ALREADY_INIT, {})
                return reject({ alreadyInit: true, supported: true })
            } 
            
            if(SELF._idb) {
                let dbName = (namespace && typeof namespace === 'string') ? SELF._idb_name + '_' + namespace : SELF._idb_name
                SELF._opendb(dbName, (err, successObj) => {
                    if(err) {
                        LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_COULD_NOT_OPEN, { dbError: true, errorText: err.error, dbObject : err })
                        return reject({ dbError: true, errorText: err.error, supported: true })
                    }

                    SELF._init = true
                    LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_OPEN_SUCCESS, {})
                    return resolve({ initial: successObj.initial, supported: true })

                }, SELF._idb_version)
            } else {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_SUPPORTED, {})
                return reject({ supported: false })
            }
        })
    }

    _opendb (name, callback, version) {
        let request = null
        let upgrade = false
        let initial = false
        let updateVersions = {old: null, new: null} 
        if(version) {
            request = SELF._idb.open(name, version)
        } else {
            request = SELF._idb.open(name)
        }

        request.onerror = (event) => {
            callback({ error: request.error, event: event, request: request })
        }

        request.onsuccess = (event) => {
            SELF._db = request.result
            callback(null, { db: request.result, request: request, event: event, upgrade: upgrade, initial: initial, versions: updateVersions })
        };

        request.onupgradeneeded = (event) => {
            upgrade = true
            LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.IDB_WILL_UPGRADE, {})

            SELF._db = event.target.result
            let transaction = event.target.transaction

            function storeCreateIndex (objectStore, name, options) {
                if (!objectStore.indexNames.contains(name)) {
                    objectStore.createIndex(name, name, options);
                }
            }


            let filesStore
            if(event.oldVersion != 0 && event.oldVersion != event.newVersion) {
                updateVersions.old = event.oldVersion
                updateVersions.new = event.newVersion
                // Actual Upgrade
                filesStore = transaction.objectStore('files')
            } else {
                // First time initializing DB
                initial = true
                filesStore = SELF._db.createObjectStore("files", { keyPath: "filename" })
            }
            
            storeCreateIndex(filesStore, 'filename', { unique: false } )
            storeCreateIndex(filesStore, 'modified', { unique: false } )
        };
    }


    // Persist takes no arguments.
    // It will ask or attempt to persist in whatever way the target browser deals with it
    // Persist will always resolve unless the entire class was not initialized.
    // Can check 'persistent' to see if request was approved by user/browser and 'canPersist' to see if it was possible in the first place. 
    persist () {
        return new Promise((resolve, reject) => {
            if(!SELF._init) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, { method: 'persist' })
                return reject({ message: MESSAGES.IDB_NOT_INIT, init: false })
            }
        
            if (navigator.storage && navigator.storage.persist) {
                navigator.storage.persist().then((persistent) => {
                    if (persistent) {
                        LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_PERSIST_PASS, { persistent: true, canPersist: true })
                        return resolve({ persistent: true, canPersist: true })
                    } else {
                        LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.IDB_PERSIST_FAIL, { persistent: false, canPersist: true })
                        return resolve({ persistent: false, canPersist: true })
                    }
                });
            } else {
                LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.IDB_PERSIST_NONE, { persistent: false, canPersist: false })
                return resolve({ persistent: false, canPersist: false })
            }
        })
    }


    // Save is in charge of taking any type of input and converting it to a common format for storing into the inner database
    // A file will be saved, and in order to access it and load it, the filename will be the 'key'
    // By default, same filename being used will overwrite whatever was there previously with no warning.
    // @TODO: overwrite global option?, accept file input dialog thing, accept base64 string, accept dom element?
    /**
     * Saves a file to the database
     * @param {string} filename - Acts as a unique identifier for the stored file, extension may be used to determine mimetype automatically.
     * @param {string | Blob | FileAbstraction} contents - raw contents of the file.
     * @param {string} [mimetype] - Optionally force a mimetype on the saved file, regardless of extension or if a blob already has a mimetype.
     * @returns {Promise} - Returns a Promise which resolves if the file is saved properly. 
     */
    save (filename, contents, mimetype) {
        return new Promise((resolve, reject) => {
            // Validation and Blob Creation.
            if(!SELF._init) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, { method: 'save' })
                return reject({ init: false })
            }

            if(!filename || typeof filename !== 'string' || filename.length < 1) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, { invalidFilename: true })
                return reject({ init: true, invalidFilename: true })
            }

            let fileToSave = SELF._createFileToSave({ filename: filename, contents: contents, mimeType: mimetype })

            if(!fileToSave) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_WRONG_CONTENT, { invalidContents: true })
                return reject({ init: true, invalidContents: true })
            } 

            // Indexed DB implementation
            let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
            let objectStore = transaction.objectStore("files")

            let addRequest = objectStore.put(fileToSave._toIDB())

            addRequest.onsuccess = (event) => {
                LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_SAVE_SUCCESS, { event: event })
                return resolve({})
            }

            addRequest.onerror = (event) => {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_SAVE_FAIL, { event: event })
                return reject({ dbError: true, errorText: transaction.error })
            }
        })
    }

    // filename, onSuccess, onFail
    load (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC
        let filename = params.filename

        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'load'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        if(!filename || typeof filename !== 'string' || filename.length < 1) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, {method: 'load', filename: filename})
            onFail({message: MESSAGES.IDB_BAD_FILENAME, errors: {filename: true} })
            return
        }

        let transaction = SELF._db.transaction(["files"])
        let objectStore = transaction.objectStore("files")
        let request = objectStore.get(filename)

        request.onsuccess = (event) => {
            // Do something with the request.result!
            if(request.result) {
                let fileToLoad = new FileAbstraction(request.result)
                LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_LOAD_SUCCESS, {file: fileToLoad, event: event, request: request})
                onSuccess(fileToLoad, {event: event, request: request})
            } else {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_FIND_FAIL, {event: event, request: request, errors: {notFound: true} })
                onFail({message: MESSAGES.IDB_LOAD_FIND_FAIL, event: event, request: request, errors: {notFound: true} })
            }
        }

        request.onerror = (event) => {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_FAIL, {event: event, request: request, errors: {db: true}})
            onFail({message: MESSAGES.IDB_LOAD_FAIL, event: event, request: request, errors: {db: true}})
        }
    }

    // onSuccess, onFail
    loadAll (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC

        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'loadAll'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
        let objectStore = transaction.objectStore("files")

        if(objectStore.getAll) {
            // Parameters for getAll (query, maxToReturnIfOver1)
            let getRequest = objectStore.getAll()
            
            getRequest.onsuccess = function(event) {
                let files = []
                if(!event.target.result[0]) {
                    if(event.target.result && event.target.result.filename) {
                        files.push(new FileAbstraction(event.target.result))
                    }
                } else {
                    for(let r in event.target.result) {
                        if(event.target.result[r] && event.target.result[r].filename) {
                            files.push(new FileAbstraction(event.target.result[r]))
                        }
                    }
                }
                LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_LOAD_ALL_SUCCESS, {files: files, event: event, request: getRequest})
                onSuccess(files, {message: MESSAGES.IDB_LOAD_ALL_SUCCESS, event: event, request: getRequest})
            }

            getRequest.onerror = function(event) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_ALL_FAIL, {event: event, request: getRequest, errors: {db: true}})
                onFail({message: MESSAGES.IDB_LOAD_ALL_FAIL, event: event, request: getRequest, errors: {db: true}})
            }
        } else {
            // Fallback to the traditional cursor approach if getAll isn't supported.
            let files = []
            let cursorRequest = objectStore.openCursor()
            
            cursorRequest.onsuccess = function(event) {
                let cursor = event.target.result
                if (cursor) {
                    if(cursor.value && cursor.value.filename) {
                        files.push(new FileAbstraction(cursor.value))
                    }
                    cursor.continue()
                } else {
                    LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_LOAD_ALL_SUCCESS, {files: files, event: event, request: cursorRequest})
                    onSuccess(files, {message: MESSAGES.IDB_LOAD_ALL_SUCCESS, event: event, request: cursorRequest})
                }
            }

            cursorRequest.onerror = function(event) {
                LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_ALL_FAIL, {event: event, request: cursorRequest, errors: {db: true}})
                onFail({message: MESSAGES.IDB_LOAD_ALL_FAIL, event: event, request: cursorRequest, errors: {db: true}})
            }
        }

    }

    delete (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC
        let filename = params.filename

        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'delete'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        if(!filename || typeof filename !== 'string' || filename.length < 1) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, {errors: { filename: true }})
            onFail({message: MESSAGES.IDB_BAD_FILENAME, errors: { filename: true } })
            return
        }

        let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
        let objectStore = transaction.objectStore("files")

        let deleteRequest = objectStore.delete(filename)

        transaction.oncomplete = function(event) {
            LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_DELETE_SUCCESS, {event: event, request: deleteRequest, transaction: transaction})
            onSuccess({message: MESSAGES.IDB_DELETE_SUCCESS, event: event, request: deleteRequest, transaction: transaction})
        }
    
        transaction.onerror = function(event) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_DELETE_FAIL, {error: transaction.error, event: event, request: deleteRequest})
            onFail({message: MESSAGES.IDB_DELETE_FAIL, error: transaction.error, event: event, request: deleteRequest})
        }
    }


    deleteAll (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC

        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'delete'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
        let objectStore = transaction.objectStore("files")

        let clearRequest = objectStore.clear()

        transaction.oncomplete = function(event) {
            LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_DELETE_ALL_SUCCESS, {event: event, request: clearRequest})
            onSuccess({message: MESSAGES.IDB_DELETE_ALL_SUCCESS, event: event, request: clearRequest})
        };
    
        transaction.onerror = function(event) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_DELETE_ALL_FAIL, {error: transaction.error, event: event, request: clearRequest})
            onFail({message: MESSAGES.IDB_DELETE_ALL_FAIL, error: transaction.error, event: event, request: clearRequest})
        };
    }

    // Return a File Abstraction
    _createFileToSave ({filename, contents, mimeType}) {
        if(!mimeType || typeof mimeType !== 'string' || mimeType == '') {
            mimeType = null
        }

        if(!contents) {
            return
        }
        
        let ext = this._getExtension(filename)
        let existingMime = this._getMimeType(ext)
        let givenMimeType = (!mimeType || typeof mimeType !== 'string' || mimeType == '') ? null : mimeType
        let newBlob = null

        if(typeof contents === 'string') {
            if(!givenMimeType) {
                if(ext) {
                    if(existingMime) {
                        newBlob = new Blob([contents], {type: existingMime})
                    } else {
                        LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave'})
                        newBlob = new Blob([contents], {type: 'text/plain'})
                    }
                } else {
                    LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave'})
                    newBlob = new Blob([contents], {type: 'text/plain'})
                }
            } else {
                newBlob = new Blob([contents], {type: givenMimeType})
            }
        } else if (contents instanceof Blob) {
            if(contents.type == '') {
                if(!givenMimeType) {
                    if(existingMime) {
                        newBlob = new Blob([contents], {type: existingMime})
                    } else {
                        LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave'})
                        newBlob = new Blob([contents], {type: 'application/octet-stream'})
                    }
                } else {
                    newBlob = new Blob([contents], {type: givenMimeType})
                }
            } else {
                if(!givenMimeType) {
                    newBlob = contents
                } else {
                    newBlob = new Blob([contents], {type: givenMimeType})
                }
            }
        } else if (contents instanceof FileAbstraction) {
            if(!givenMimeType) {
                if(existingMime) {
                    newBlob = new Blob([contents.blob], {type: existingMime})
                } else {
                    LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave'})
                    newBlob = new Blob([contents.blob], {type: 'application/octet-stream'})
                }
            } else {
                newBlob = new Blob([contents.blob], {type: givenMimeType})
            }
        } else {
            return null
        }

        let fileToSave = new FileAbstraction({
            filename: filename,
            blob: newBlob,
            lastModified: (new Date()).getTime(),
            extension: ext,
            size: newBlob.size
        })

        return fileToSave
    }

    _getExtension (string) {
        let ext = null
        if(string.indexOf('.') != -1) {
            ext = string.split('.').pop().toLowerCase()
            if(ext.length <= 2) { // ???
                ext = null
            }
        }
        return ext
    }

    _getMimeType (extension) {
        let mime = null
        if(extension) {
            mime = MIMETYPES[extension]
        }
        return mime
    }

}


// ******************* //
// **** EXPORTING **** //
// ******************* //
SELF = new BrowserFileStorage()

// Browser export as a global
if(typeof window !== 'undefined') {
    window.browserFileStorage = SELF
}

// Node / Webpack export
// Note: This should not be required in Node, as it uses browser APIs
export default SELF