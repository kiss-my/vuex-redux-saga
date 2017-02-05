import Vue from 'vue';
import Vuex from 'vuex';
import test from 'ava';
import sinon from 'sinon';
import { take, put, select } from 'redux-saga/effects';

import createSagaPlugin from '../src';

Vue.use(Vuex);

const noop = () => true;

test.beforeEach(t => {
  // eslint-disable-next-line no-param-reassign
  t.context.store = new Vuex.Store({
    state: { someNumber: 42 },
    mutations: { action1: noop, action2: noop, action3: noop },
  });
});

test('take effect works', t => {
  const plugin = createSagaPlugin();
  plugin(t.context.store);
  const takeSpy = sinon.spy();
  const check = function* checkSaga() {
    const action = yield take('action1');
    t.is(action.type, 'action1');
    t.deepEqual(action.payload, { data: 'foo' });
    takeSpy();
  };

  plugin.run(check);
  t.context.store.commit('action1', { data: 'foo' });
  t.true(takeSpy.calledOnce);
});

test('put effect works', t => {
  const plugin = createSagaPlugin();
  plugin(t.context.store);
  const spy = sinon.spy(t.context.store, 'commit');
  const check = function* checkSaga() {
    yield put({ type: 'action2' });
  };

  plugin.run(check);
  t.true(spy.calledOnce);
});

test('select effect works', t => {
  const plugin = createSagaPlugin();
  plugin(t.context.store);

  let sagaCalled = false;
  const check = function* checkSaga() {
    const data = yield select();
    t.deepEqual(data, { someNumber: 42 });
    sagaCalled = true;
  };

  plugin.run(check);
  t.true(sagaCalled);
});

test('should throw if emitter option is passed', t => {
  t.throws(() => createSagaPlugin({ emitter: () => true }));
});

test('should throw if logger is not a function', t => {
  t.throws(() => createSagaPlugin({ logger: 42 }));
});

test('should throw if onError is not a function', t => {
  t.throws(() => createSagaPlugin({ onError: 42 }));
});

test('should properly pass additional arguments to saga', t => {
  const plugin = createSagaPlugin();
  plugin(t.context.store);
  const spy = sinon.spy();
  // eslint-disable-next-line require-yield
  const check = function* checkSaga(foo, bar, baz) {
    spy();
    t.is(foo, 1);
    t.is(bar, '2');
    t.is(baz, true);
  };
  plugin.run(check, 1, '2', true);
  t.true(spy.called);
});

test('should throw if trying to run saga before adding plugin to store', t => {
  const plugin = createSagaPlugin();
  const spy = sinon.spy();
  // eslint-disable-next-line require-yield
  const check = function* checkSaga() {
    spy();
  };
  t.throws(() => plugin.run(check, 1, '2', true));
  t.false(spy.called);
});

test('should throw if attempting to run non-function', t => {
  const plugin = createSagaPlugin();
  plugin(t.context.store);
  t.throws(() => plugin.run(42));
});

test('fills empty sagaMonior properties with noop', t => {
  const plugin = createSagaPlugin({ sagaMonitor: {} });
  plugin(t.context.store);
  const spy = sinon.spy();
  // eslint-disable-next-line require-yield
  plugin.run(function* check() {
    spy();
  });
  t.true(spy.called);
});
