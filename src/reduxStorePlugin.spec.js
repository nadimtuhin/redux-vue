import expect from 'expect';
import reduxStorePlugin from './reduxStorePlugin';

// Stub Vue: capture the mixin so its beforeCreate hook can be called directly
function installPlugin(storeId) {
  let mixin;
  const Vue = { mixin(m) { mixin = m; } };
  reduxStorePlugin(Vue, storeId);
  return mixin;
}

describe('reduxStorePlugin', () => {
  it('injects the store from the default `store` option', () => {
    const mixin = installPlugin();
    const store = {};
    const vm = { $options: { store } };
    mixin.beforeCreate.call(vm);
    expect(vm.$store).toBe(store);
  });

  it('injects the store from a custom storeId option', () => {
    const mixin = installPlugin('reduxStore');
    const store = {};
    const vm = { $options: { reduxStore: store } };
    mixin.beforeCreate.call(vm);
    expect(vm.$store).toBe(store);
  });

  it('inherits the store from the parent component', () => {
    const mixin = installPlugin();
    const store = {};
    const vm = { $options: { parent: { $store: store } } };
    mixin.beforeCreate.call(vm);
    expect(vm.$store).toBe(store);
  });
});
