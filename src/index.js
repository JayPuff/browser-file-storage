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

    logLevel (level) {
        LOGGER.logLevel(level)
    }

    init (params) {
        params = params || {}
        let namespace = params.namespace
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC

        if(SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_ALREADY_INIT, {})
            onFail({message: MESSAGES.IDB_ALREADY_INIT, supported: true})
            return
        }

        SELF._namespace = namespace
        let dbName = (namespace && typeof namespace === 'string') ? SELF._idb_name + '_' + namespace : SELF._idb_name 
        if(!SELF._idb) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_SUPPORTED, {})
            onFail({message: MESSAGES.IDB_NOT_SUPPORTED, supported: false})
        } else {
            SELF._opendb(dbName, (err, successObj) => {
                if(err) {
                    LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_COULD_NOT_OPEN, {err : err})
                    onFail({message: MESSAGES.IDB_COULD_NOT_OPEN, error: err.error, supported: true})
                    return
                }

                LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_OPEN_SUCCESS, successObj || {})
                SELF._init = true
                onSuccess({message: MESSAGES.IDB_OPEN_SUCCESS, supported: true, initial: successObj.initial, upgrade: successObj.upgrade, versions: successObj.versions})
            }, SELF._idb_version)
        }
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


    persist (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC

        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'persist'})
            onFail({message: MESSAGES.IDB_NOT_INIT, method: 'persist'})
            return
        }

        // Can also call perisisted() Promise to see current mode.
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then( persistent => {
                if (persistent) {
                    LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_PERSIST_PASS, {})
                    onSuccess({message: MESSAGES.IDB_PERSIST_PASS, persistent: true})
                } else {
                    LOGGER.log(LOGGER.LEVEL_WARN, MESSAGES.IDB_PERSIST_FAIL, {})
                    onFail({message: MESSAGES.IDB_PERSIST_FAIL, canPersist: true})
                }
            });
        } else {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_PERSIST_NONE, {})
            onFail({message: MESSAGES.IDB_PERSIST_NONE, canPersist: false})
        }
    }

    // Force the mode?
    // Auto detect if possible
    // mime types? can extract ext name from filename and map it to list of mime types.
    // Does this overwrite by default? probably.
    // base 64???
    // blob
    // fileupload
    // raw binary... string???
    save (params) {
        params = params || {}
        let onSuccess = params.onSuccess || EMPTY_FUNC
        let onFail = params.onFail || EMPTY_FUNC
        let contents = params.contents
        let filename = params.filename
        let mimeType = params.mimeType

        // Validation and Blob Creation.
        if(!SELF._init) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'save'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        if(!filename || typeof filename !== 'string' || filename.length < 1) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, {errors: { filename: true }})
            onFail({message: MESSAGES.IDB_BAD_FILENAME, errors: { filename: true } })
            return
        }

        if(!contents) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NO_CONTENT, {errors: { filename: false, contents: true }})
            onFail({message: MESSAGES.IDB_NO_CONTENT, errors: { filename: false, contents: true } })
            return
        }

        let fileToSave = SELF._createFileToSave({filename:filename,contents:contents,mimeType:mimeType})

        if(!fileToSave) {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_WRONG_CONTENT, {errors: { filename: false, contents: true, parseToBlob: true }})
            onFail({message: MESSAGES.IDB_WRONG_CONTENT, errors: { filename: false, contents: true, parseToBlob: true } })
            return
        } 

        // Indexed DB implementation
        let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
        let objectStore = transaction.objectStore("files")

        let addRequest = objectStore.put(fileToSave._toIDB())

        addRequest.onsuccess = (event) => {
            LOGGER.log(LOGGER.LEVEL_INFO, MESSAGES.IDB_SAVE_SUCCESS, {event: event})
            onSuccess({message: MESSAGES.IDB_SAVE_SUCCESS, event: event })
        }

        addRequest.onerror = (event) => {
            LOGGER.log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_SAVE_FAIL, {event: event})
            onFail({message: MESSAGES.IDB_SAVE_FAIL, event: event, errors: { db: true }})
        }

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

        let transaction = this._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
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

    // Return a File Abstraction
    _createFileToSave ({filename, contents, mimeType}) {
        if(!mimeType || typeof mimeType !== 'string' || mimeType == '') {
            mimeType = null
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
                    newBlob = new Blob([contents], {type: givenMimeType})
                } else {
                    newBlob = contents
                }
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