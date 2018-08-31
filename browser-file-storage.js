(() => {
    // ****************** //
    // **** GLOBALS **** //
    // ***************** //

    const MESSAGES = {
        IDB_NOT_SUPPORTED: "Indexed DB is not supported on this browser.",

        IDB_OPEN_SUCCESS: "Indexed DB Opened successfully.",

        IDB_WILL_UPGRADE: "About to upgrade inner database structure.",
    }

    const LOGGER = {
        DEFAULT_LEVEL: 1,
        LEVEL_NONE: 0,
        LEVEL_ERROR: 1,
        LEVEL_WARN: 2,
        LEVEL_INFO: 3,
        PREFIX: 'Browser File Storage - '
    }

    const IDB = {
        NAME: "BROWSER_FILE_STORAGE_JS",
        CURRENT_VERSION: 2,
    }


    // *************************** //
    // **** CLASS DECLARATION **** //
    // *************************** //

    class BrowserFileStorage {
        constructor () {
            this._init = false
            this._idb  = null
            this._db   = null
            this._namespace = null
            this._logLevel = LOGGER.DEFAULT_LEVEL

            this._idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"} // This line should only be needed if it is needed to support the object's constants for older browsers
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
        }

        logLevel (level) {
            if(typeof level === 'number') {
                this._logLevel = level
            } else if (typeof level == 'string') {
                if(level == 'none') {
                    this._logLevel = LOGGER.LEVEL_NONE
                } else if(level == 'error') {
                    this._logLevel = LOGGER.LEVEL_ERROR
                } else if(level == 'warn') {
                    this._logLevel = LOGGER.LEVEL_WARN
                } else if(level == 'info') {
                    this._logLevel = LOGGER.LEVEL_INFO
                }
            } else {
                this._logLevel = LOGGER.DEFAULT_LEVEL
            }
        }

        _log (level, message, attachedObject) {
            if(this._logLevel >= level) {
                console.log(LOGGER.PREFIX + message, attachedObject)
            }
        }


        init ({namespace, onSuccess, onFail}) {
            this._namespace = namespace
            let dbName = (namespace && typeof namespace === 'string') ? IDB.NAME + '_' + namespace : IDB.NAME 
            if(!this._idb) {
                this._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_NOT_SUPPORTED, {})
                onFail(MESSAGES.IDB_NOT_SUPPORTED, {})
            } else {
                this._opendb(dbName, (err, attachedInnerObject) => {
                    if(err) {
                        this._log(LOGGER.LEVEL_ERROR, MESSAGES.IDB_COULD_NOT_OPEN, {err : err})
                        onFail(MESSAGES.IDB_COULD_NOT_OPEN, {err : err})
                        return
                    }
    
                    this._log(LOGGER.LEVEL_INFO, MESSAGES.IDB_OPEN_SUCCESS, attachedInnerObject || {})
                    this._init = true
                    onSuccess( MESSAGES.IDB_OPEN_SUCCESS, attachedInnerObject || {})
                }, IDB.CURRENT_VERSION)
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
    
    
                let filesStore, sequenceStore
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

    }
 
    
    // ******************* //
    // **** EXPORTING **** //
    // ******************* //
    let browserFileStorage = new BrowserFileStorage()
    
    // Node / Webpack export
    // Note: This should not be required in Node, as it uses browser APIs
    if (typeof(module) !== "undefined" && module.exports) {
        module.exports = browserFileStorage;
        
     // Browser export as a global
    } else if(typeof window !== 'undefined') {
        window.browserFileStorage = browserFileStorage
    }
    
})()