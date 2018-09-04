import MESSAGES from './messages'
import MIMETYPES from './mimetypes'
import LOGGER from './logger'

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
        this._idb_version = 2,

        this._idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"} // This line should only be needed if it is needed to support the object's constants for older browsers
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    }

    logLevel (level) {
        LOGGER.logLevel(level)
    }

    _log (level, message, attachedObject) {
        LOGGER.log(level, message, attachedObject)
    }


    init ({namespace, onSuccess, onFail}) {
        if(SELF._init) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_ALREADY_INIT, {})
            onFail({message: MESSAGES.IDB_ALREADY_INIT, supported: true})
            return
        }

        SELF._namespace = namespace
        let dbName = (namespace && typeof namespace === 'string') ? SELF._idb_name + '_' + namespace : SELF._idb_name 
        if(!SELF._idb) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_SUPPORTED, {})
            onFail({message: MESSAGES.IDB_NOT_SUPPORTED, supported: false})
        } else {
            SELF._opendb(dbName, (err, successObj) => {
                if(err) {
                    SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_COULD_NOT_OPEN, {err : err})
                    onFail({message: MESSAGES.IDB_COULD_NOT_OPEN, error: err.error, supported: true})
                    return
                }

                SELF._log(LOGGER.LEVEL_INFO, MESSAGES.IDB_OPEN_SUCCESS, successObj || {})
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
            request = this._idb.open(name, version)
        } else {
            request = this._idb.open(name)
        }

        request.onerror = (event) => {
            callback({ error: request.error, event: event, request: request })
        }

        request.onsuccess = (event) => {
            this._db = request.result
            callback(null, { db: request.result, request: request, event: event, upgrade: upgrade, initial: initial, versions: updateVersions })
        };

        request.onupgradeneeded = (event) => {
            upgrade = true
            this._log(LOGGER.LEVEL_WARN, MESSAGES.IDB_WILL_UPGRADE, {})

            this._db = event.target.result
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
                filesStore = this._db.createObjectStore("files", { keyPath: "path" })
            }
            
            storeCreateIndex(filesStore, 'name', { unique: false } )
            storeCreateIndex(filesStore, 'modified', { unique: false } )
        };
    }


    persist ({onSuccess, onFail}) {
        if(!SELF._init) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'persist'})
            onFail({message: MESSAGES.IDB_NOT_INIT, method: 'persist'})
            return
        }

        // Can also call perisisted() Promise to see current mode.
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then( persistent => {
                if (persistent) {
                    SELF._log(LOGGER.LEVEL_INFO, MESSAGES.IDB_PERSIST_PASS, {})
                    onSuccess({message: MESSAGES.IDB_PERSIST_PASS, persistent: true})
                } else {
                    SELF._log(LOGGER.LEVEL_WARN, MESSAGES.IDB_PERSIST_FAIL, {})
                    onFail({message: MESSAGES.IDB_PERSIST_FAIL, canPersist: true})
                }
            });
        } else {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_PERSIST_NONE, {})
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
    save ({filename, content, onSuccess, onFail, mimeType}) {
        // Validation and Blob Creation.
        if(!SELF._init) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'save'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        if(!filename || typeof filename !== 'string' || filename.length < 1) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, {errors: { filename: true }})
            onFail({message: MESSAGES.IDB_BAD_FILENAME, errors: { filename: true } })
            return
        }

        if(!content) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NO_CONTENT, {errors: { filename: false, content: true }})
            onFail({message: MESSAGES.IDB_NO_CONTENT, errors: { filename: false, content: true } })
            return
        }

        let blobToSave = SELF._createBlobToSave({filename:filename,content:content,mimeType:mimeType})

        if(!blobToSave) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_WRONG_CONTENT, {errors: { filename: false, content: true, parseToBlob: true }})
            onFail({message: MESSAGES.IDB_WRONG_CONTENT, errors: { filename: false, content: true, parseToBlob: true } })
            return
        } 

        // Indexed DB implementation
        let transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite")
        let objectStore = transaction.objectStore("files")

        let addRequest = objectStore.put({
            path: filename,
            lastModified: (new Date()).getTime(),
            blob: blobToSave 
        })

        addRequest.onsuccess = (event) => {
            SELF._log(LOGGER.LEVEL_INFO, MESSAGES.IDB_SAVE_SUCCESS, {event: event})
            onSuccess({message: MESSAGES.IDB_SAVE_SUCCESS, event: event })
        }

        addRequest.onerror = (event) => {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_SAVE_FAIL, {event: event})
            onFail({message: MESSAGES.IDB_SAVE_FAIL, event: event, errors: { db: true }})
        }

    }


    load ({filename, onSuccess, onFail}) {
        if(!SELF._init) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_INIT, {method: 'load'})
            onFail({message: MESSAGES.IDB_NOT_INIT})
            return
        }

        if(!filename || typeof filename !== 'string' || filename.length < 1) {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_BAD_FILENAME, {method: 'load', filename: filename})
            onFail({message: MESSAGES.IDB_BAD_FILENAME, errors: {filename: true} })
            return
        }

        let transaction = SELF._db.transaction(["files"])
        let objectStore = transaction.objectStore("files")
        let request = objectStore.get(filename)

        request.onsuccess = (event) => {
            // Do something with the request.result!
            if(request.result) {
                SELF._log(LOGGER.LEVEL_INFO, MESSAGES.IDB_LOAD_SUCCESS, {event: event, request: request})
                onSuccess(request.result, {event: event, request: request})
            } else {
                SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_FIND_FAIL, {event: event, request: request, errors: {notFound: true} })
                onFail({message: MESSAGES.IDB_LOAD_FIND_FAIL, event: event, request: request, errors: {notFound: true} })
            }
        }

        request.onerror = (event) => {
            SELF._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_LOAD_FAIL, {event: event, request: request, errors: {db: true}})
            onFail({message: MESSAGES.IDB_LOAD_FAIL, event: event, request: request, errors: {db: true}})
        }
    }

    // Return a Blob
    _createBlobToSave ({filename, content, mimeType}) {
        if(!mimeType || typeof mimeType !== 'string' || mimeType == '') {
            mimeType = null
        }
        
        let ext = this._getExtension(filename)
        let existingMime = this._getMimeType(ext)
        let givenMimeType = (!mimeType || typeof mimeType !== 'string' || mimeType == '') ? null : mimeType
        let newBlob = null

        if(typeof content === 'string') {
            if(!givenMimeType) {
                if(ext) {
                    if(existingMime) {
                        newBlob = new Blob([content], {type: existingMime})
                    } else {
                        this._log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave'})
                        newBlob = new Blob([content])
                    }
                } else {
                    this._log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave'})
                    newBlob = new Blob([content])
                }
            } else {
                newBlob = new Blob([content], {type: givenMimeType})
            }
        } else if (content instanceof Blob) {
            if(content.type == '') {
                if(!givenMimeType) {
                    if(existingMime) {
                        newBlob = new Blob([content], {type: existingMime})
                    } else {
                        this._log(LOGGER.LEVEL_WARN, MESSAGES.NO_MIME_TYPE, {filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave'})
                        newBlob = new Blob([content])
                    }
                } else {
                    newBlob = new Blob([content], {type: givenMimeType})
                }
            } else {
                if(!givenMimeType) {
                    newBlob = new Blob([content], {type: givenMimeType})
                } else {
                    newBlob = content
                }
            }
        } else {
            return null
        }

        return newBlob
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