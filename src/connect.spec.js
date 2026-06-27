import expect from 'expect';
import connect from './connect';
import { createStore } from 'redux';

// Minimal redux store
function makeStore(initialState = { count: 1 }) {
  return createStore((state = initialState, action) => {
    if (action.type === 'INCREMENT') return { ...state, count: state.count + 1 };
    return state;
  });
}

// Stub Vue-like component context factory
// connect() returns a component descriptor; we unit-test its lifecycle methods directly.
function makeContext({ store, attrs = {}, stateNames = [], actionNames = [] } = {}) {
  const ctx = {
    $store: store,
    _self: {
      $options: {
        _parentVnode: {
          data: { attrs }
        }
      }
    },
    vuaReduxStateNames: stateNames,
    vuaReduxActionNames: actionNames,
    vuaReduxUnsubscribe: null,
  };
  // Allow property assignment like Vue does
  return ctx;
}

describe('connect()', () => {
  describe('mergeProps (issue: PR #5)', () => {
    it('passes state + actions props to mergeProps and uses its result', () => {
      const store = makeStore({ count: 7 });
      const mapState = (state) => ({ count: state.count });
      const mapActions = (dispatch) => ({ inc: () => dispatch({ type: 'INCREMENT' }) });
      const mergeProps = (stateProps, actionProps) => ({
        total: stateProps.count + 1,
        doInc: actionProps.inc,
      });

      const HOC = connect(mapState, mapActions, mergeProps)(
        { name: 'Child', props: { total: Number, doInc: Function } }
      );

      // Call data() with a faked context to get initial merged props
      const ctx = makeContext({ store });
      const data = HOC.data.call(ctx);

      expect(data.total).toEqual(8);
      expect(typeof data.doInc).toEqual('function');
      // original state/action keys should NOT be present when mergeProps is used
      expect(data.count).toEqual(undefined);
    });
  });

  describe('pass-through unmapped attrs (issue #6)', () => {
    it('includes unmapped parent attrs in rendered props', () => {
      const store = makeStore({ count: 1 });
      const mapState = (state) => ({ count: state.count });

      const HOC = connect(mapState)({ name: 'Child', props: {} });
      const ctx = makeContext({ store, attrs: { nonMappedProp: 'Foo' }, stateNames: ['count'], actionNames: [] });
      ctx.count = 1;

      const props = HOC.render.call(ctx, (tag, config) => config.props);
      expect(props.nonMappedProp).toEqual('Foo');
      expect(props.count).toEqual(1);
    });

    it('does not crash when parent vnode has no attrs', () => {
      const store = makeStore({ count: 1 });
      const mapState = (state) => ({ count: state.count });

      const HOC = connect(mapState)({ name: 'Child', props: {} });
      // Simulate missing attrs (root component scenario)
      const ctx = {
        $store: store,
        _self: { $options: { _parentVnode: { data: {} } } },
        vuaReduxStateNames: ['count'],
        vuaReduxActionNames: [],
        count: 1,
      };

      let threw = false;
      try {
        HOC.render.call(ctx, (tag, config) => config.props);
      } catch (e) {
        threw = true;
      }
      expect(threw).toEqual(false);
    });
  });

  describe('slots pass-through (issue #3)', () => {
    it('forwards $slots to child component', () => {
      const store = makeStore({ count: 1 });
      const mapState = (state) => ({ count: state.count });

      const HOC = connect(mapState)({ name: 'Child', props: {} });
      const slotContent = [{ tag: 'span', children: [] }];
      const ctx = makeContext({ store, attrs: {}, stateNames: ['count'], actionNames: [] });
      ctx.count = 1;
      ctx.$slots = { default: slotContent };

      const renderConfig = HOC.render.call(ctx, (tag, config) => config);
      expect(renderConfig.slots).toEqual(ctx.$slots);
    });
  });

  describe('methods pass-through (issue: PR #2)', () => {
    it('preserves child component methods', () => {
      const store = makeStore({ count: 1 });
      const child = {
        name: 'Child',
        props: {},
        methods: { greet() { return 'hello'; } }
      };

      const HOC = connect()(child);
      // The connected component should not strip child methods
      // (methods live on the child, not the HOC, but the HOC must not clobber them)
      const ctx = makeContext({ store, stateNames: [], actionNames: [] });
      const data = HOC.data.call(ctx);
      // Child methods still accessible on child descriptor
      expect(typeof child.methods.greet).toEqual('function');
    });
  });
});
