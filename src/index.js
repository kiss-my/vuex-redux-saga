/* eslint-disable */
import { runSaga, stdChannel } from 'redux-saga'

const isFunc = f => typeof f === 'function'
const noop = () => undefined

export default (sagas, options = {}) => {
  const { sagaMonitor } = options

  if (sagaMonitor) {
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop
  }

  if (options.logger && !isFunc(options.logger)) {
    throw new Error('`options.logger` passed to the Saga plugin is not a function!')
  }

  if (options.onError && !isFunc(options.onError)) {
    throw new Error('`options.onError` passed to the Saga plugin is not a function!')
  }

  if (options.emitter) {
    throw new Error('`options.emitter` is not yet supported by Saga plugin!')
  }

  let subscribed = false
  const sagaPlugin = (store) => {
    if (!subscribed) {
      const channel = stdChannel()
      // Subscribe to the store mutations.
      store.subscribe((mutation, state) => channel.put(mutation))

      // Subscribe to the store actions and put a message in the channel for each.
      store.subscribeAction((action, state) => channel.put(action))
      subscribed = true
      sagas.forEach((saga) => {
        // Allows passing per-saga arguments by
        // exporting a saga as an object
        // in the form `saga = { saga: function * (), args: {} }`
        if (typeof saga === 'object' && saga.callable && saga.args) {
          sagaPlugin.run(store, channel, saga.callable, saga.args)
        } else {
          sagaPlugin.run(store, channel, saga, store)
        }
      })
    }
  }

  sagaPlugin.run = (store, channel, saga, ...args) => {
    if (!store) {
      throw new Error('Before running a Saga, you must add Saga plugin to vuex store')
    }

    if (!isFunc(saga)) {
      throw new Error(
        '`sagaPlugin.run(saga, ...args)`: saga argument must be a Generator function',
      )
    }
    runSaga({
        channel,
        dispatch: ({type, payload}) => store.dispatch(type, payload),
        getState: () => store.state,
        sagaMonitor,
        // TODO allow passing these per-saga
        logger: options.logger,
        onError: options.onError,
      },
      saga,
      ...args,
    )
  }

  return sagaPlugin
};
