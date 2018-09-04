(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("browser-file-storage", [], factory);
	else if(typeof exports === 'object')
		exports["browser-file-storage"] = factory();
	else
		root["browser-file-storage"] = factory();
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messages = __webpack_require__(1);

var _messages2 = _interopRequireDefault(_messages);

var _mimetypes = __webpack_require__(2);

var _mimetypes2 = _interopRequireDefault(_mimetypes);

var _logger = __webpack_require__(3);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDB = {
    NAME: "BROWSER_FILE_STORAGE_JS",
    CURRENT_VERSION: 2
};

var SELF = null;

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

        this._idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" // This line should only be needed if it is needed to support the object's constants for older browsers
        };window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }

    _createClass(BrowserFileStorage, [{
        key: 'logLevel',
        value: function logLevel(level) {
            _logger2.default.logLevel(level);
        }
    }, {
        key: '_log',
        value: function _log(level, message, attachedObject) {
            _logger2.default.log(level, message, attachedObject);
        }
    }, {
        key: 'init',
        value: function init(_ref) {
            var namespace = _ref.namespace,
                onSuccess = _ref.onSuccess,
                onFail = _ref.onFail;

            if (SELF._init) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_ALREADY_INIT, {});
                onFail({ message: _messages2.default.IDB_ALREADY_INIT, supported: true });
                return;
            }

            SELF._namespace = namespace;
            var dbName = namespace && typeof namespace === 'string' ? IDB.NAME + '_' + namespace : IDB.NAME;
            if (!SELF._idb) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_SUPPORTED, {});
                onFail({ message: _messages2.default.IDB_NOT_SUPPORTED, supported: false });
            } else {
                SELF._opendb(dbName, function (err, successObj) {
                    if (err) {
                        SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_COULD_NOT_OPEN, { err: err });
                        onFail({ message: _messages2.default.IDB_COULD_NOT_OPEN, error: err.error, supported: true });
                        return;
                    }

                    SELF._log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_OPEN_SUCCESS, successObj || {});
                    SELF._init = true;
                    onSuccess({ message: _messages2.default.IDB_OPEN_SUCCESS, supported: true, initial: successObj.initial, upgrade: successObj.upgrade, versions: successObj.versions });
                }, IDB.CURRENT_VERSION);
            }
        }
    }, {
        key: '_opendb',
        value: function _opendb(name, callback, version) {
            var _this = this;

            var request = null;
            var upgrade = false;
            var initial = false;
            var updateVersions = { old: null, new: null };
            if (version) {
                request = this._idb.open(name, version);
            } else {
                request = this._idb.open(name);
            }

            request.onerror = function (event) {
                callback({ error: request.error, event: event, request: request });
            };

            request.onsuccess = function (event) {
                _this._db = request.result;
                callback(null, { db: request.result, request: request, event: event, upgrade: upgrade, initial: initial, versions: updateVersions });
            };

            request.onupgradeneeded = function (event) {
                upgrade = true;
                _this._log(_logger2.default.LEVEL_WARN, _messages2.default.IDB_WILL_UPGRADE, {});

                _this._db = event.target.result;
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
                    filesStore = _this._db.createObjectStore("files", { keyPath: "path" });
                }

                storeCreateIndex(filesStore, 'name', { unique: false });
                storeCreateIndex(filesStore, 'modified', { unique: false });
            };
        }
    }, {
        key: 'persist',
        value: function persist(_ref2) {
            var onSuccess = _ref2.onSuccess,
                onFail = _ref2.onFail;

            if (!SELF._init) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'persist' });
                onFail({ message: _messages2.default.IDB_NOT_INIT, method: 'persist' });
                return;
            }

            // Can also call perisisted() Promise to see current mode.
            if (navigator.storage && navigator.storage.persist) {
                navigator.storage.persist().then(function (persistent) {
                    if (persistent) {
                        SELF._log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_PERSIST_PASS, {});
                        onSuccess({ message: _messages2.default.IDB_PERSIST_PASS, persistent: true });
                    } else {
                        SELF._log(_logger2.default.LEVEL_WARN, _messages2.default.IDB_PERSIST_FAIL, {});
                        onFail({ message: _messages2.default.IDB_PERSIST_FAIL, canPersist: true });
                    }
                });
            } else {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_PERSIST_NONE, {});
                onFail({ message: _messages2.default.IDB_PERSIST_NONE, canPersist: false });
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

    }, {
        key: 'save',
        value: function save(_ref3) {
            var filename = _ref3.filename,
                content = _ref3.content,
                onSuccess = _ref3.onSuccess,
                onFail = _ref3.onFail,
                mimeType = _ref3.mimeType;

            // Validation and Blob Creation.
            if (!SELF._init) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'save' });
                onFail({ message: _messages2.default.IDB_NOT_INIT });
                return;
            }

            if (!filename || typeof filename !== 'string' || filename.length < 1) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_BAD_FILENAME, { errors: { filename: true } });
                onFail({ message: _messages2.default.IDB_BAD_FILENAME, errors: { filename: true } });
                return;
            }

            if (!content) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NO_CONTENT, { errors: { filename: false, content: true } });
                onFail({ message: _messages2.default.IDB_NO_CONTENT, errors: { filename: false, content: true } });
                return;
            }

            var blobToSave = SELF._createBlobToSave({ filename: filename, content: content, mimeType: mimeType });

            if (!blobToSave) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_WRONG_CONTENT, { errors: { filename: false, content: true, parseToBlob: true } });
                onFail({ message: _messages2.default.IDB_WRONG_CONTENT, errors: { filename: false, content: true, parseToBlob: true } });
                return;
            }

            // Indexed DB implementation
            var transaction = SELF._db.transaction(["files"], IDBTransaction.READ_WRITE || "readwrite");
            var objectStore = transaction.objectStore("files");

            var addRequest = objectStore.put({
                path: filename,
                lastModified: new Date().getTime(),
                blob: blobToSave
            });

            addRequest.onsuccess = function (event) {
                SELF._log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_SAVE_SUCCESS, { event: event });
                onSuccess({ message: _messages2.default.IDB_SAVE_SUCCESS, event: event });
            };

            addRequest.onerror = function (event) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_SAVE_FAIL, { event: event });
                onFail({ message: _messages2.default.IDB_SAVE_FAIL, event: event, errors: { db: true } });
            };
        }
    }, {
        key: 'load',
        value: function load(_ref4) {
            var filename = _ref4.filename,
                onSuccess = _ref4.onSuccess,
                onFail = _ref4.onFail;

            if (!SELF._init) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_NOT_INIT, { method: 'load' });
                onFail({ message: _messages2.default.IDB_NOT_INIT });
                return;
            }

            if (!filename || typeof filename !== 'string' || filename.length < 1) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_BAD_FILENAME, { method: 'load', filename: filename });
                onFail({ message: _messages2.default.IDB_BAD_FILENAME, errors: { filename: true } });
                return;
            }

            var transaction = SELF._db.transaction(["files"]);
            var objectStore = transaction.objectStore("files");
            var request = objectStore.get(filename);

            request.onsuccess = function (event) {
                // Do something with the request.result!
                if (request.result) {
                    SELF._log(_logger2.default.LEVEL_INFO, _messages2.default.IDB_LOAD_SUCCESS, { event: event, request: request });
                    onSuccess(request.result, { event: event, request: request });
                } else {
                    SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_FIND_FAIL, { event: event, request: request, errors: { notFound: true } });
                    onFail({ message: _messages2.default.IDB_LOAD_FIND_FAIL, event: event, request: request, errors: { notFound: true } });
                }
            };

            request.onerror = function (event) {
                SELF._log(_logger2.default.LEVEL_ERROR, _messages2.default.IDB_LOAD_FAIL, { event: event, request: request, errors: { db: true } });
                onFail({ message: _messages2.default.IDB_LOAD_FAIL, event: event, request: request, errors: { db: true } });
            };
        }

        // Return a Blob

    }, {
        key: '_createBlobToSave',
        value: function _createBlobToSave(_ref5) {
            var filename = _ref5.filename,
                content = _ref5.content,
                mimeType = _ref5.mimeType;

            if (!mimeType || typeof mimeType !== 'string' || mimeType == '') {
                mimeType = null;
            }

            var ext = this._getExtension(filename);
            var existingMime = this._getMimeType(ext);
            var givenMimeType = !mimeType || typeof mimeType !== 'string' || mimeType == '' ? null : mimeType;
            var newBlob = null;

            if (typeof content === 'string') {
                if (!givenMimeType) {
                    if (ext) {
                        if (existingMime) {
                            newBlob = new Blob([content], { type: existingMime });
                        } else {
                            this._log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave' });
                            newBlob = new Blob([content]);
                        }
                    } else {
                        this._log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave' });
                        newBlob = new Blob([content]);
                    }
                } else {
                    newBlob = new Blob([content], { type: givenMimeType });
                }
            } else if (content instanceof Blob) {
                if (content.type == '') {
                    if (!givenMimeType) {
                        if (existingMime) {
                            newBlob = new Blob([content], { type: existingMime });
                        } else {
                            this._log(_logger2.default.LEVEL_WARN, _messages2.default.NO_MIME_TYPE, { filename: filename, content: content, mimeType: mimeType, method: '_createBlobToSave' });
                            newBlob = new Blob([content]);
                        }
                    } else {
                        newBlob = new Blob([content], { type: givenMimeType });
                    }
                } else {
                    if (!givenMimeType) {
                        newBlob = new Blob([content], { type: givenMimeType });
                    } else {
                        newBlob = content;
                    }
                }
            } else {
                return null;
            }

            return newBlob;
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
    IDB_NO_CONTENT: "No Content specified.",
    IDB_WRONG_CONTENT: "Content given is not a string nor blob",

    IDB_SAVE_SUCCESS: "Successfully saved a file to database.",
    IDB_SAVE_FAIL: "Failed at saving file to database.",

    IDB_LOAD_SUCCESS: "Successfully loaded a file from database.",
    IDB_LOAD_FIND_FAIL: "Could not find the file in the database.",
    IDB_LOAD_FAIL: "Failed at loading file from database.",

    NO_MIME_TYPE: "File saved with no mimetype."
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'json': 'application/json'
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

/***/ })
/******/ ]);
});