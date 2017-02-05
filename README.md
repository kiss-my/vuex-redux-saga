# vuex-redux-saga [![NPM version](https://img.shields.io/npm/v/vuex-redux-saga.svg?style=flat-square)](https://www.npmjs.com/package/vuex-redux-saga) [![Build Status](https://img.shields.io/travis/xanf/vuex-redux-saga.svg?style=flat-square)](https://travis-ci.org/xanf/vuex-redux-saga)
Use [redux-saga](https://github.com/redux-saga/redux-saga) with [Vuex](https://vuex.vuejs.org)

## Overview
[redux-saga](https://github.com/redux-saga/redux-saga) is an awesome library that aims to make side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier and better.

While originally targetting [Redux](https://github.com/reactjs/redux), `redux-saga` is actually not strictly tied to `redux` and do not rely on any internals of it's implementation. Actually `redux-saga` could be used with Vuex with `put` effect commiting mutations

This library wraps `redux-saga` so it can be used as [Vuex](https://vuex.vuejs.org/) plugin. It's external interface is similar to middleware provided by `redux-saga`.
## Installation

```bash
$ npm install --save vuex-redux-saga redux-saga
```

## Usage
```js
import createSagaPlugin from 'vuex-redux-saga'

const sagaPlugin = createSagaPlugin();
const store = new Vuex.Store({
  // ...
  plugins: [ sagaPlugin ]
});

// launch your sagas
sagas.forEach(sagaPlugin.run);
```

## API
### `createSagaPlugin(options)`

Creates a Vuex plugin and connects the Sagas to the Vuex Store

- `options: Object` - A list of options to pass to the middleware. Currently supported options are:

  - `sagaMonitor` : [SagaMonitor](https://redux-saga.github.io/redux-saga/docs/api/index.html#sagamonitor) - If a Saga Monitor is provided, the middleware will deliver monitoring events to the monitor.

  - `logger` : Function -  defines a custom logger for sagas. By default, saga runner logs all errors and
warnings to the console. This option tells plugin to send errors/warnings to the provided logger instead. The logger is called with the params `(level, ...args)`. The 1st indicates the level of the log ('info', 'warning' or 'error'). The rest corresponds to the following arguments (You can use `args.join(' ') to concatenate all args into a single String`).
  - `onError` : Function - if provided, the middleware will call it with uncaught errors from Sagas. useful for sending uncaught exceptions to error tracking services.

### `sagaPlugin.run(saga, ...args)`

Dynamically run `saga`. Can be used to run Sagas **only after** `sagaPlugin` was added to instance of `Vuex.Store`.

- `saga: Function`: a Generator function
- `args: Array<any>`: arguments to be provided to `saga`

The method returns a [Task descriptor](https://redux-saga.github.io/redux-saga/docs/api/index.html#task-descriptor).

#### Notes

`saga` must be a function which returns a [Generator Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).
See awesome [redux-saga docs](https://redux-saga.github.io/redux-saga/docs) for more details

## License

MIT © [Illya Klymov](https://github.com/xanf)