import normalizeProps from './normalizeProps';

function noop() {}

function getStore(component) {
  return component.$store;
}

function getAttrs(component) {
  // issue #6: guard against missing attrs (root component has no _parentVnode attrs)
  const vnode = component._self.$options._parentVnode;
  return (vnode && vnode.data && vnode.data.attrs) || {};
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
  const attrs = getAttrs(component);
  const stateNames = component.vuaReduxStateNames;
  const actionNames = component.vuaReduxActionNames;
  const mergedNames = component.vuaReduxMergedNames;

  // mergeProps path: only expose merged keys
  if (mergedNames) {
    const props = {};
    for (let ii = 0; ii < mergedNames.length; ii++) {
      props[mergedNames[ii]] = component[mergedNames[ii]];
    }
    return { ...props, ...attrs };
  }

  const props = {};
  for (let ii = 0; ii < stateNames.length; ii++) {
    props[stateNames[ii]] = component[stateNames[ii]];
  }
  for (let ii = 0; ii < actionNames.length; ii++) {
    props[actionNames[ii]] = component[actionNames[ii]];
  }

  return { ...props, ...attrs };
}

/**
 * @param mapStateToProps
 * @param mapActionsToProps
 * @param mergeProps - optional; receives (stateProps, dispatchProps) -> props
 * @returns Function (children) => VueComponentDescriptor
 */
export default function connect(mapStateToProps, mapActionsToProps, mergeProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;

  return (children) => {

    /** @namespace children.collect */
    if (children.collect) {
      children.props = {
        ...normalizeProps(children.props || {}),
        ...normalizeProps(children.collect || {}),
      };

      const msg = `vua-redux: collect is deprecated, use props ` +
        `in ${children.name || 'anonymous'} component`;

      console.warn(msg);
    }

    return {
      name: `ConnectVuaRedux-${children.name || 'children'}`,

      render(h) {
        const props = getProps(this);
        // issue #3: forward $slots to child
        return h(children, { props, slots: this.$slots });
      },

      data() {
        const state = getStates(this, mapStateToProps);
        const actions = getActions(this, mapActionsToProps);

        if (mergeProps) {
          // PR #5: mergeProps support
          const merged = mergeProps(state, actions) || {};
          const mergedNames = Object.keys(merged);
          return {
            ...merged,
            vuaReduxMergedNames: mergedNames,
            vuaReduxStateNames: [],
            vuaReduxActionNames: [],
          };
        }

        const stateNames = Object.keys(state);
        const actionNames = Object.keys(actions);

        return {
          ...state,
          ...actions,
          vuaReduxStateNames: stateNames,
          vuaReduxActionNames: actionNames,
        };
      },

      created() {
        const store = getStore(this);

        this.vuaReduxUnsubscribe = store.subscribe(() => {
          const state = getStates(this, mapStateToProps);
          const actions = getActions(this, mapActionsToProps);

          if (mergeProps) {
            const merged = mergeProps(state, actions) || {};
            const mergedNames = Object.keys(merged);
            this.vuaReduxMergedNames = mergedNames;
            for (let ii = 0; ii < mergedNames.length; ii++) {
              this[mergedNames[ii]] = merged[mergedNames[ii]];
            }
            return;
          }

          const stateNames = Object.keys(state);
          this.vuaReduxStateNames = stateNames;
          for (let ii = 0; ii < stateNames.length; ii++) {
            this[stateNames[ii]] = state[stateNames[ii]];
          }
        });
      },

      beforeDestroy() {
        this.vuaReduxUnsubscribe();
      },
    };
  };
}
