(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("redux-saga"));
	else if(typeof define === 'function' && define.amd)
		define(["redux-saga"], factory);
	else if(typeof exports === 'object')
		exports["VuexReduxSaga"] = factory(require("redux-saga"));
	else
		root["VuexReduxSaga"] = factory(root["ReduxSaga"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxSaga = __webpack_require__(0);

var isFunc = function isFunc(f) {
  return typeof f === 'function';
};
var noop = function noop() {
  return undefined;
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var sagaMonitor = options.sagaMonitor;


  if (sagaMonitor) {
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop;
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop;
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop;
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop;
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop;
  }

  if (options.logger && !isFunc(options.logger)) {
    throw new Error('`options.logger` passed to the Saga plugin is not a function!');
  }

  if (options.onError && !isFunc(options.onError)) {
    throw new Error('`options.onError` passed to the Saga plugin is not a function!');
  }

  if (options.emitter) {
    throw new Error('`options.emitter` is not yet supported by Saga plugin!');
  }

  var store = void 0;
  var sagaPlugin = function sagaPlugin(_store) {
    store = _store;
  };

  sagaPlugin.run = function (saga) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!store) {
      throw new Error('Before running a Saga, you must add Saga plugin to vuex store');
    }

    if (!isFunc(saga)) {
      throw new Error('`sagaPlugin.run(saga, ...args)`: saga argument must be a Generator function');
    }

    (0, _reduxSaga.runSaga)(saga.apply(undefined, args), {
      subscribe: function subscribe(callback) {
        return store.subscribe(callback);
      },
      dispatch: function dispatch(output) {
        return store.commit(output);
      },
      getState: function getState() {
        return store.state;
      },
      logger: options.logger,
      sagaMonitor: sagaMonitor,
      onError: options.onError
    });
  };

  return sagaPlugin;
};

module.exports = exports['default'];

/***/ })
/******/ ]);
});