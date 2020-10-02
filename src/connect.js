import normalizeProps from './normalizeProps';

function noop() {
}

//to get the store for connecting redux
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
  const stateNames = component.vuaReduxStateNames;
  const actionNames = component.vuaReduxActionNames;

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

      const msg = `vua-redux: collect is deprecated, use props ` +
        `in ${children.name || 'anonymous'} component`;

      console.warn(msg);
    }

    return {
      name: `ConnectVuaRedux-${children.name || 'children'}`,

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
          vuaReduxStateNames: stateNames,
          vuaReduxActionNames: actionNames
        };
      },

      created() {
        const store = getStore(this);

        this.vuaReduxUnsubscribe = store.subscribe(() => {
          const state = getStates(this, mapStateToProps);
          const stateNames = Object.keys(state);
          this.vuaReduxStateNames = stateNames;

          for (let ii = 0; ii < stateNames.length; ii++) {
            this[stateNames[ii]] = state[stateNames[ii]];
          }
        });
      },

      beforeDestroy() {
        this.vuaReduxUnsubscribe();
      }
    };
  };
}
