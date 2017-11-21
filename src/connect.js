import normalizeProps from './normalizeProps';

function noop() {
}

function getStore(component) {
  return component.$store;
}

function getAttrs(component) {
  const attrs = component._self.$options._parentVnode.data.attrs;
  if (!attrs) {
    return attrs
  }
  // Convert props from kebab-case to camelCase notation
  return Object.keys(attrs).reduce((memo, key) => ({
    ...memo,
    [key.replace(/[-](.)/g, (match, group) => group.toUpperCase())]: attrs[key],
  }), {})
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
  const propNames = component.vuaReduxPropNames;

  for (let ii = 0; ii < propNames.length; ii++) {
    props[propNames[ii]] = component[propNames[ii]];
  }

  return {
    ...props,
    ...attrs
  };
}

function defaultMergeProps(stateProps, actionsProps) {
  return {
    ...stateProps,
    ...actionsProps,
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
 * @param mergeProps
 * @returns Object
 */
export default function connect(mapStateToProps, mapActionsToProps, mergeProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;
  mergeProps = mergeProps || defaultMergeProps;

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
        const merged = mergeProps(state, actions);
        const propNames = Object.keys(merged);

        return {
          ...merged,
          vuaReduxPropNames: propNames,
        };
      },

      created() {
        const store = getStore(this);

        this.vuaReduxUnsubscribe = store.subscribe(() => {
          const state = getStates(this, mapStateToProps);
          const actions = getActions(this, mapActionsToProps);
          const merged = mergeProps(state, actions);
          const propNames = Object.keys(merged);
          this.vuaReduxPropNames = propNames;

          for (let ii = 0; ii < propNames.length; ii++) {
            this[propNames[ii]] = merged[propNames[ii]];
          }
        });
      },

      beforeDestroy() {
        this.vuaReduxUnsubscribe();
      }
    };
  };
}
