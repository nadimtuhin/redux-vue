import normalizeProps from './normalizeProps';

function noop() {
}

function getStore(component) {
  return component.$store;
}

function getAttrs(component) {
  return component._self.$options._parentVnode.data.attrs;
}

function getStates(component, mapStateToProps) {
  const store = getStore(component);
  const attrs = getAttrs(component);

  return mapStateToProps(store.getState(), attrs) || {};
}

function getActions(component, mapActionsToProps) {
  const store = getStore(component);

  return mapActionsToProps(store.dispatch, getAttrs.bind(null, component)) || {};
}

function getProps(component) {
  let props = {};
  const attrs = getAttrs(component);
  const stateNames = component.vueReduxStateNames;
  const actionNames = component.vueReduxActionNames;

  for (let ii = 0; ii < stateNames.length; ii++) {
    props[stateNames[ii]] = component[stateNames[ii]];
  }

  for (let ii = 0; ii < actionNames.length; ii++) {
    props[actionNames[ii]] = component[actionNames[ii]];
  }

  return {
    ...props,
    ...attrs
  };
}

/**
 * 1. utilities are moved above because vue stores methods, states and props
 * in the same namespace
 * 2. actions are set while created
 */

/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @returns Object
 */
export default function connect(mapStateToProps, mapActionsToProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;

  return (children) => {

    /** @namespace children.collect */
    if (children.collect) {
      children.props = {
        ...normalizeProps(children.props || {}),
        ...normalizeProps(children.collect || {})
      };

      const msg = `redux-vue-connect: collect is deprecated, use props ` +
        `in ${children.name || 'anonymous'} component`;

      console.warn(msg);
    }

    return {
      name: `ReduxVueConnect-${children.name || 'children'}`,

      render(h) {
        const props = getProps(this);

        return h(children, { props });
      },

      data() {
        const state = getStates(this, mapStateToProps);
        const actions = getActions(this, mapActionsToProps);
        const stateNames = Object.keys(state);
        const actionNames = Object.keys(actions);

        return {
          ...state,
          ...actions,
          vueReduxStateNames: stateNames,
          vueReduxActionNames: actionNames
        };
      },

      created() {
        const store = getStore(this);

        this.vueReduxUnsubscribe = store.subscribe(() => {
          const state = getStates(this, mapStateToProps);
          const stateNames = Object.keys(state);
          this.vueReduxStateNames = stateNames;

          for (let ii = 0; ii < stateNames.length; ii++) {
            this[stateNames[ii]] = state[stateNames[ii]];
          }
        });
      },

      beforeDestroy() {
        this.vueReduxUnsubscribe();
      },

      methods: children.methods
    };
  };
}
