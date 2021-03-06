(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messages = __webpack_require__(1);

var _messages2 = _interopRequireDefault(_messages);

var _mimetypes = __webpack_require__(2);

var _mimetypes2 = _interopRequireDefault(_mimetypes);

var _logger = __webpack_require__(3);

var _logger2 = _interopRequireDefault(_logger);

var _file = __webpack_require__(4);

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SELF = null; // This messes up if end-user uses arrow functions in some cases...

// *************************** //
// **** CLASS DECLARATION **** //
// *************************** //

var BrowserFileStorage = function () {
    function BrowserFileStorage() {
        _classCallCheck(this, BrowserFileStorage);

        this._init = false;
        this._idb = null;
        this._db = null;
        this._namespace = null;
        this._idb_name = "BROWSER_FILE_STORAGE_JS", this._idb_version = 3, this._idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" // This line should only be needed if it is needed to support the object's constants for older browsers
        };window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }

    // Set log level for browserFileStorage
    // 'none', 'error', 'warn', 'info' 


    _createClass(BrowserFileStorage, [{
        key: 'logLevel',
        value: function logLevel(level) {
            _logger2.default.logLevel(level);
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

    }, {
        key: 'init',
        value: function init(namespace) {
            return new Promise(function (resolve, reject) {
                if (SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_ALREADY_INIT, {});
                    return reject({ alreadyInit: true, supported: true });
                }

                if (SELF._idb) {
                    var dbName = namespace && typeof namespace === 'string' ? SELF._idb_name + '_' + namespace : SELF._idb_name;
                    SELF._opendb(dbName, function (err, successObj) {
                        if (err) {
                            _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_COULD_NOT_OPEN, { dbError: true, error: err.error, e: err });
                            return reject({ dbError: true, error: err.error, supported: true });
                        }

                        SELF._init = true;
                        _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_OPEN_SUCCESS, {});
                        return resolve({ initial: successObj.initial, supported: true });
                    }, SELF._idb_version);
                } else {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_SUPPORTED, {});
                    return reject({ supported: false });
                }
            });
        }

        // Persist takes no arguments.
        // It will ask or attempt to persist in whatever way the target browser deals with it
        // Persist will always resolve unless the entire class was not initialized.
        // Can check 'persistent' to see if request was approved by user/browser and 'canPersist' to see if it was possible in the first place. 
        /**
         * Requests permission to the user/browser for file persistency. 
         * @returns {Promise} - Returns a Promise which resolves with an object containing persistency status.
         */

    }, {
        key: 'persist',
        value: function persist() {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'persist' });
                    return reject({ message: _messages2.default.IDB_NOT_INIT, init: false });
                }

                if (navigator.storage && navigator.storage.persist) {
                    navigator.storage.persist().then(function (persistent) {
                        if (persistent) {
                            _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_PERSIST_PASS, { persistent: true, canPersist: true });
                            return resolve({ persistent: true, canPersist: true });
                        } else {
                            _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.IDB_PERSIST_FAIL, { persistent: false, canPersist: true });
                            return resolve({ persistent: false, canPersist: true });
                        }
                    });
                } else {
                    _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.IDB_PERSIST_NONE, { persistent: false, canPersist: false });
                    return resolve({ persistent: false, canPersist: false });
                }
            });
        }

        // Save is in charge of taking any type of input and converting it to a common format for storing into the inner database
        // A file will be saved, and in order to access it and load it, the filename will be the 'key'
        // By default, same filename being used will overwrite whatever was there previously with no warning.
        // @TODO: overwrite global option?, accept file input dialog thing, accept base64 string, accept js object -> stringify??, accept dom element?
        /**
         * Saves a file to the database
         * @param {string} filename - Acts as a unique identifier for the stored file, extension may be used to determine mimetype automatically.
         * @param {string | Blob | BrowserFile} contents - raw contents of the file.
         * @param {string} [mimetype] - Optionally force a mimetype on the saved file, regardless of extension or if a blob already has a mimetype.
         * @param {Object} [metadata] - Optionally send a JS object to store as metadata for this file.
         * @returns {Promise} - Returns a Promise which resolves with the BrowserFile object that was saved.  
         */

    }, {
        key: 'save',
        value: function save(filename, contents, mimetype, metadata) {
            return new Promise(function (resolve, reject) {
                // Validation and Blob Creation.
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'save' });
                    return reject({ init: false });
                }

                if (!filename || typeof filename !== 'string' || filename.length < 1) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_BAD_FILENAME, { invalidFilename: true });
                    return reject({ init: true, invalidFilename: true });
                }

                var fileToSave = SELF._createFileToSave({ filename: filename, contents: contents, mimeType: mimetype, metadata: metadata });

                if (!fileToSave) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_WRONG_CONTENT, { invalidContents: true });
                    return reject({ init: true, invalidContents: true });
                }

                // Indexed DB implementation
                var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
                var objectStore = transaction.objectStore("files");

                var addRequest = objectStore.put(fileToSave._toIDB());

                addRequest.onsuccess = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_SAVE_SUCCESS, { file: fileToSave, e: event });
                    return resolve(fileToSave);
                };

                addRequest.onerror = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_SAVE_FAIL, { e: event });
                    return reject({ init: true, dbError: true, error: addRequest.error });
                };
            });
        }

        // Load will access the inner database and fetch the file as a BrowserFile object
        /**
         * Loads a file from the database.
         * @param {string} filename - Acts as a unique identifier for the stored file
         * @returns {Promise} - Returns a Promise which resolves if the file is loaded properly with the BrowserFile object. 
         */

    }, {
        key: 'load',
        value: function load(filename) {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'load' });
                    return reject({ init: false });
                }

                if (!filename || typeof filename !== 'string' || filename.length < 1) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_BAD_FILENAME, { invalidFilename: true });
                    return reject({ init: true, invalidFilename: true });
                }

                var transaction = SELF._db.transaction(["files"]);
                var objectStore = transaction.objectStore("files");
                var request = objectStore.get(filename);

                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    if (request.result) {
                        var fileToLoad = new _file2.default(request.result);
                        _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_SUCCESS, { file: fileToLoad, e: event });
                        return resolve(fileToLoad);
                    } else {
                        _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_FIND_FAIL, { e: event });
                        return reject({ init: true, notFound: true });
                    }
                };

                request.onerror = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_FAIL, { e: event });
                    return reject({ init: true, dbError: true, error: request.error });
                };
            });
        }

        // Load All will load all existing saved files into an array of BrowserFile
        /**
         * Returns all currently saved files 
         * @returns {Promise} - Returns a Promise which resolves with an array containing all saved files.
         */

    }, {
        key: 'loadAll',
        value: function loadAll() {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'loadAll' });
                    return reject({ init: false });
                }

                var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
                var objectStore = transaction.objectStore("files");

                if (objectStore.getAll) {
                    // Parameters for getAll (query, maxToReturnIfOver1)
                    var getRequest = objectStore.getAll();

                    getRequest.onsuccess = function (event) {
                        var files = [];
                        if (!event.target.result[0]) {
                            if (event.target.result && event.target.result.filename) {
                                files.push(new _file2.default(event.target.result));
                            }
                        } else {
                            for (var r in event.target.result) {
                                if (event.target.result[r] && event.target.result[r].filename) {
                                    files.push(new _file2.default(event.target.result[r]));
                                }
                            }
                        }
                        _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_ALL_SUCCESS, { files: files });
                        return resolve(files);
                    };

                    getRequest.onerror = function (event) {
                        _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_ALL_FAIL, { e: event });
                        return reject({ init: true, dbError: true, error: getRequest.error });
                    };
                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var files = [];
                    var cursorRequest = objectStore.openCursor();

                    cursorRequest.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value && cursor.value.filename) {
                                files.push(new _file2.default(cursor.value));
                            }
                            cursor.continue();
                        } else {
                            _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_ALL_SUCCESS, { files: files });
                            return resolve(files);
                        }
                    };

                    cursorRequest.onerror = function (event) {
                        _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_ALL_FAIL, { e: event });
                        return reject({ init: true, dbError: true, error: cursorRequest.error });
                    };
                }
            });
        }

        // lists all filenames without loading the actual files from storage
        /**
         * Returns all current keys/filenames to files stored 
         * @returns {Promise} - Returns a Promise which resolves with an array containing all current keys/filenames for files stored
         */

    }, {
        key: 'list',
        value: function list() {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'list' });
                    return reject({ init: false });
                }

                var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
                var objectStore = transaction.objectStore("files");

                if (objectStore.getAllKeys) {
                    // Parameters for getAll (query, maxToReturnIfOver1)
                    var getRequest = objectStore.getAllKeys();

                    getRequest.onsuccess = function (event) {
                        _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_ALL_KEYS_SUCCESS, { keys: event.target.result });
                        return resolve(event.target.result);
                    };

                    getRequest.onerror = function (event) {
                        _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_ALL_KEYS_FAIL, { e: event });
                        return reject({ init: true, dbError: true, error: getRequest.error });
                    };
                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var filenames = [];
                    var cursorRequest = objectStore.openCursor();

                    cursorRequest.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            if (cursor.key) {
                                filenames.push(cursor.key);
                            }
                            cursor.continue();
                        } else {
                            _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_ALL_KEYS_SUCCESS, { keys: filenames });
                            return resolve(filenames);
                        }
                    };

                    cursorRequest.onerror = function (event) {
                        _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_ALL_KEYS_FAIL, { e: event });
                        return reject({ init: true, dbError: true, error: cursorRequest.error });
                    };
                }
            });
        }

        // Deletes a file if it exists
        // Even if the file does not exist, returned promise resolves.
        /**
         * Deletes a specific file from the inner database.
         * @param {string} filename - Acts as a unique identifier to find the stored file.
         * @returns {Promise} - Returns a Promise which resolves once the file is ensured to be deleted. 
         */

    }, {
        key: 'delete',
        value: function _delete(filename) {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'delete' });
                    return reject({ init: false });
                }

                if (!filename || typeof filename !== 'string' || filename.length < 1) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_BAD_FILENAME, { invalidFilename: true });
                    return reject({ init: true, invalidFilename: true });
                }

                var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
                var objectStore = transaction.objectStore("files");

                var deleteRequest = objectStore.delete(filename);

                transaction.oncomplete = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_DELETE_SUCCESS, {});
                    return resolve();
                };

                transaction.onerror = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_DELETE_FAIL, { e: event });
                    return reject({ init: true, dbError: true, error: transaction.error });
                };
            });
        }

        // Delete All will delete all existing saved files within the inner database and within the namespace.
        /**
         * Deletes all current files within the inner database on this namespace.
         * @returns {Promise} - Returns a Promise which resolves if the operation was successful
         */

    }, {
        key: 'deleteAll',
        value: function deleteAll() {
            return new Promise(function (resolve, reject) {
                if (!SELF._init) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'deleteAll' });
                    return reject({ init: false });
                }

                var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
                var objectStore = transaction.objectStore("files");

                var clearRequest = objectStore.clear();

                transaction.oncomplete = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_DELETE_ALL_SUCCESS, {});
                    return resolve();
                };

                transaction.onerror = function (event) {
                    _logger2.default.log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_DELETE_ALL_FAIL, { e: event });
                    return reject({ init: true, dbError: true, error: transaction.error });
                };
            });
        }

        // Return a File Abstraction

    }, {
        key: '_createFileToSave',
        value: function _createFileToSave(_ref) {
            var filename = _ref.filename,
                contents = _ref.contents,
                mimeType = _ref.mimeType,
                metadata = _ref.metadata;

            if (!mimeType || typeof mimeType !== 'string' || mimeType == '') {
                mimeType = null;
            }

            if (!contents) {
                return;
            }

            var ext = this._getExtension(filename);
            var existingMime = this._getMimeType(ext);
            var givenMimeType = !mimeType || typeof mimeType !== 'string' || mimeType == '' ? null : mimeType;
            var newBlob = null;

            if (typeof contents === 'string') {
                if (!givenMimeType) {
                    if (ext) {
                        if (existingMime) {
                            newBlob = new Blob([contents], { type: existingMime });
                        } else {
                            _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave' });
                            newBlob = new Blob([contents], { type: 'text/plain' });
                        }
                    } else {
                        _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave' });
                        newBlob = new Blob([contents], { type: 'text/plain' });
                    }
                } else {
                    newBlob = new Blob([contents], { type: givenMimeType });
                }
            } else if (contents instanceof Blob) {
                if (contents.type == '') {
                    if (!givenMimeType) {
                        if (existingMime) {
                            newBlob = new Blob([contents], { type: existingMime });
                        } else {
                            _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave' });
                            newBlob = new Blob([contents], { type: 'application/octet-stream' });
                        }
                    } else {
                        newBlob = new Blob([contents], { type: givenMimeType });
                    }
                } else {
                    if (!givenMimeType) {
                        newBlob = contents;
                    } else {
                        newBlob = new Blob([contents], { type: givenMimeType });
                    }
                }
            } else if (contents instanceof _file2.default) {
                if (!givenMimeType) {
                    if (existingMime) {
                        newBlob = new Blob([contents.blob], { type: existingMime });
                    } else {
                        _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, contents: contents, mimeType: mimeType, method: '_createBlobToSave' });
                        newBlob = new Blob([contents.blob], { type: 'application/octet-stream' });
                    }
                } else {
                    newBlob = new Blob([contents.blob], { type: givenMimeType });
                }
            } else {
                return null;
            }

            var validMetadataObj = {};
            try {
                if (metadata && (typeof metadata === 'undefined' ? 'undefined' : _typeof(metadata)) === 'object') {
                    validMetadataObj = JSON.parse(JSON.stringify(metadata));
                }
            } catch (error) {
                validMetadataObj = {};
            }

            var fileToSave = new _file2.default({
                filename: filename,
                blob: newBlob,
                lastModified: new Date().getTime(),
                extension: ext,
                size: newBlob.size,
                type: newBlob.type,
                metadata: validMetadataObj
            });

            return fileToSave;
        }
    }, {
        key: '_opendb',
        value: function _opendb(name, callback, version) {
            var request = null;
            var upgrade = false;
            var initial = false;
            var updateVersions = { old: null, new: null };
            if (version) {
                request = SELF._idb.open(name, version);
            } else {
                request = SELF._idb.open(name);
            }

            request.onerror = function (event) {
                callback({ error: request.error, event: event, request: request });
            };

            request.onsuccess = function (event) {
                SELF._db = request.result;
                callback(null, { db: request.result, request: request, event: event, upgrade: upgrade, initial: initial, versions: updateVersions });
            };

            request.onupgradeneeded = function (event) {
                upgrade = true;
                _logger2.default.log(_logger2.default.LEVEL_WARN, _messages2.default.IDB_WILL_UPGRADE, {});

                SELF._db = event.target.result;
                var transaction = event.target.transaction;

                function storeCreateIndex(objectStore, name, options) {
                    if (!objectStore.indexNames.contains(name)) {
                        objectStore.createIndex(name, name, options);
                    }
                }

                var filesStore = void 0;
                if (event.oldVersion != 0 && event.oldVersion != event.newVersion) {
                    updateVersions.old = event.oldVersion;
                    updateVersions.new = event.newVersion;
                    // Actual Upgrade
                    filesStore = transaction.objectStore('files');
                } else {
                    // First time initializing DB
                    initial = true;
                    filesStore = SELF._db.createObjectStore("files", { keyPath: "filename" });
                }

                storeCreateIndex(filesStore, 'filename', { unique: false });
                storeCreateIndex(filesStore, 'modified', { unique: false });
            };
        }
    }, {
        key: '_getExtension',
        value: function _getExtension(string) {
            var ext = null;
            if (string.indexOf('.') != -1) {
                ext = string.split('.').pop().toLowerCase();
                if (ext.length <= 2) {
                    // ???
                    ext = null;
                }
            }
            return ext;
        }
    }, {
        key: '_getMimeType',
        value: function _getMimeType(extension) {
            var mime = null;
            if (extension) {
                mime = _mimetypes2.default[extension];
            }
            return mime;
        }
    }]);

    return BrowserFileStorage;
}();

// ******************* //
// **** EXPORTING **** //
// ******************* //


SELF = new BrowserFileStorage();

// Browser export as a global
if (typeof window !== 'undefined') {
    window.browserFileStorage = SELF;
}

// Node / Webpack export
// Note: This should not be required in Node, as it uses browser APIs
exports.default = SELF;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    IDB_NOT_SUPPORTED: "Indexed DB is not supported on this browser.",
    IDB_NOT_INIT: "Indexed DB was not initialized. Could not call method.",
    IDB_ALREADY_INIT: "Indexed DB was already initialized.",
    IDB_OPEN_SUCCESS: "Indexed DB Opened successfully.",
    IDB_WILL_UPGRADE: "About to upgrade inner database structure.",

    IDB_PERSIST_PASS: "Asked for persistency and succeeded. Files will remain until user manually clears them.",
    IDB_PERSIST_FAIL: "Asked for persistency and failed. Files have default persistency, browser could remove them.",
    IDB_PERSIST_NONE: "Could not ask for persistency. Files have default persistency, browser could remove them.",

    IDB_BAD_FILENAME: "Filename is not a string, or is empty.",
    IDB_WRONG_CONTENT: "Content given is not valid [String, Blob, or FileAbstraction]",

    IDB_SAVE_SUCCESS: "Successfully saved a file to database.",
    IDB_SAVE_FAIL: "Failed at saving file to database.",

    IDB_LOAD_SUCCESS: "Successfully loaded a file from database.",
    IDB_LOAD_FIND_FAIL: "Could not find the file in the database.",
    IDB_LOAD_FAIL: "Failed at loading file from database.",

    IDB_LOAD_ALL_SUCCESS: "Successfully loaded all files from database.",
    IDB_LOAD_ALL_FAIL: "Could not load all files from the database.",

    IDB_LOAD_ALL_KEYS_SUCCESS: "Successfully loaded all keys/filenames from database.",
    IDB_LOAD_ALL_KEYS_FAIL: "Could not load all keys/filenames from the database.",

    IDB_DELETE_SUCCESS: "Successfully deleted a file from database.",
    IDB_DELETE_FAIL: "Failed at deleting file from database.",

    IDB_DELETE_ALL_SUCCESS: "Successfully deleted all files from database.",
    IDB_DELETE_ALL_FAIL: "Could not delete all files from the database.",

    NO_MIME_TYPE: "Cannot auto-detect mimetype for filename, setting mimetype to a safe default type"
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    "aac": "audio/aac",
    "abw": "application/x-abiword",
    "arc": "application/octet-stream",
    "avi": "video/x-msvideo",
    "azw": "application/vnd.amazon.ebook",
    "bin": "application/octet-stream",
    "bmp": "image/bmp",
    "bz": "application/x-bzip",
    "bz2": "application/x-bzip2",
    "csh": "application/x-csh",
    "css": "text/css",
    "csv": "text/csv",
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "eot": "application/vnd.ms-fontobject",
    "epub": "application/epub+zip",
    "es": "application/ecmascript",
    "gif": "image/gif",
    "htm": "text/html",
    "html": "text/html",
    "ico": "image/x-icon",
    "ics": "text/calendar",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "js": "application/javascript",
    "json": "application/json",
    "mid": "audio/midi",
    "mpeg": "video/mpeg",
    "mp4": "video/mp4",
    "mpkg": "application/vnd.apple.installer+xml",
    "odp": "application/vnd.oasis.opendocument.presentation",
    "ods": "application/vnd.oasis.opendocument.spreadsheet",
    "odt": "application/vnd.oasis.opendocument.text",
    "oga": "audio/ogg",
    "ogv": "video/ogg",
    "ogx": "application/ogg",
    "otf": "font/otf",
    "png": "image/png",
    "pdf": "application/pdf",
    "ppt": "application/vnd.ms-powerpoint",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "rar": "application/x-rar-compressed",
    "rtf": "application/rtf",
    "sh": "application/x-sh",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tiff": "image/tiff",
    "tif": "image/tiff",
    "ts": "application/typescript",
    "ttf": "font/ttf",
    "txt": "text/plain",
    "vsd": "application/vnd.visio",
    "wav": "audio/wav",
    "weba": "audio/webm",
    "webm": "video/webm",
    "webp": "image/webp",
    "woff": "font/woff",
    "woff2": "font/woff2",
    "xhtml": "application/xhtml+xml",
    "xls": "application/vnd.ms-excel",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "xml": "application/xml",
    "xul": "application/vnd.mozilla.xul+xml",
    "zip": "application/zip",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    "7z": "application/x-7z-compressed"
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var logger = {
    DEFAULT_LEVEL: 1,
    LEVEL_NONE: 0,
    LEVEL_ERROR: 1,
    LEVEL_WARN: 2,
    LEVEL_INFO: 3,
    PREFIX: 'Browser File Storage - '
};

var log = function log(level, message, attachedObject) {
    if (logger._logLevel >= level) {
        console.log(logger.PREFIX + message, attachedObject);
    }
};

var logLevel = function logLevel(level) {
    if (typeof level === 'number') {
        logger._logLevel = level;
    } else if (typeof level == 'string') {
        if (level == 'none') {
            logger._logLevel = logger.LEVEL_NONE;
        } else if (level == 'error') {
            logger._logLevel = logger.LEVEL_ERROR;
        } else if (level == 'warn') {
            logger._logLevel = logger.LEVEL_WARN;
        } else if (level == 'info') {
            logger._logLevel = logger.LEVEL_INFO;
        }
    } else {
        logger._logLevel = logger.DEFAULT_LEVEL;
    }
};

logger._logLevel = logger.DEFAULT_LEVEL;
logger.log = log;
logger.logLevel = logLevel;

exports.default = logger;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrowserFile = function () {
    function BrowserFile(props) {
        _classCallCheck(this, BrowserFile);

        this.filename = props.filename;
        this.lastModified = props.lastModified;
        this.blob = props.blob;
        this.extension = props.extension;
        this.size = props.size;
        this.type = props.type;
        this.metadata = props.metadata;
    }

    _createClass(BrowserFile, [{
        key: '_toIDB',
        value: function _toIDB() {
            return {
                filename: this.filename,
                lastModified: this.lastModified,
                blob: this.blob,
                extension: this.extension,
                size: this.size,
                type: this.type,
                metadata: this.metadata
            };
        }
    }, {
        key: 'createURL',
        value: function createURL() {
            if (this._createdURL) {
                return this._createdURL;
            }
            this._createdURL = URL.createObjectURL(this.blob);
            return this._createdURL;
        }
    }, {
        key: 'destroyURL',
        value: function destroyURL() {
            if (this._createdURL) {
                URL.revokeObjectURL(this._createdURL);
                this._createdURL = null;
            }
        }
    }, {
        key: '_toSomething',
        value: function _toSomething(mode) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (FileReader) {
                    var reader = new FileReader();

                    if (!_this.blob) {
                        return reject({ supported: true, fileError: true });
                    }

                    reader.addEventListener('loadend', function (e) {
                        return resolve(e.srcElement.result);
                    });

                    reader.addEventListener('error', function (e) {
                        return reject({ supported: true, readError: true, e: e });
                    });

                    reader[mode](_this.blob);
                } else {
                    return reject({ supported: false });
                }
            });
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this._toSomething('readAsText');
        }
    }, {
        key: 'toBinaryString',
        value: function toBinaryString() {
            return this._toSomething('readAsBinaryString');
        }
    }, {
        key: 'toArrayBuffer',
        value: function toArrayBuffer() {
            return this._toSomething('readAsArrayBuffer');
        }
    }, {
        key: 'toDataURL',
        value: function toDataURL() {
            return this._toSomething('readAsDataURL');
        }
    }]);

    return BrowserFile;
}();

exports.default = BrowserFile;

/***/ })
/******/ ]);
});