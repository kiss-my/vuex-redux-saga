import { runSaga } from 'redux-saga';

const isFunc = f => typeof f === 'function';
const noop = () => undefined;

export default (options = {}) => {
  const { sagaMonitor } = options;

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

  let store;
  const sagaPlugin = _store => {
    store = _store;
  };

  sagaPlugin.run = (saga, ...args) => {
    if (!store) {
      throw new Error('Before running a Saga, you must add Saga plugin to vuex store');
    }

    if (!isFunc(saga)) {
      throw new Error(
        '`sagaPlugin.run(saga, ...args)`: saga argument must be a Generator function',
      );
    }

    runSaga(saga(...args), {
      subscribe: callback => store.subscribe(callback),
      dispatch: output => store.commit(output),
      getState: () => store.state,
      logger: options.logger,
      sagaMonitor,
      onError: options.onError,
    });
  };

  return sagaPlugin;
};
