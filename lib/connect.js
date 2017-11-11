'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = connect;

var _normalizeProps = require('./normalizeProps');

var _normalizeProps2 = _interopRequireDefault(_normalizeProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

function getStore(component) {
  return component.$store;
}

function getAttrs(component) {
  return component._self.$options._parentVnode.data.attrs;
}

function getStates(component, mapStateToProps) {
  var store = getStore(component);
  var attrs = getAttrs(component);

  return mapStateToProps(store.getState(), attrs) || {};
}

function getActions(component, mapActionsToProps) {
  var store = getStore(component);

  return mapActionsToProps(store.dispatch, getAttrs.bind(null, component)) || {};
}

function getProps(component) {
  var props = {};
  var attrs = getAttrs(component);
  var propNames = component.vuaReduxPropNames;

  for (var ii = 0; ii < propNames.length; ii++) {
    props[propNames[ii]] = component[propNames[ii]];
  }

  return _extends({}, props, attrs);
}

function defaultMergeProps(stateProps, actionsProps) {
  return _extends({}, stateProps, actionsProps);
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
function connect(mapStateToProps, mapActionsToProps, mergeProps) {
  mapStateToProps = mapStateToProps || noop;
  mapActionsToProps = mapActionsToProps || noop;
  mergeProps = mergeProps || defaultMergeProps;

  return function (children) {

    /** @namespace children.collect */
    if (children.collect) {
      children.props = _extends({}, (0, _normalizeProps2.default)(children.props || {}), (0, _normalizeProps2.default)(children.collect || {}));

      var msg = 'vua-redux: collect is deprecated, use props ' + ('in ' + (children.name || 'anonymous') + ' component');

      console.warn(msg);
    }

    return {
      name: 'ConnectVuaRedux-' + (children.name || 'children'),

      render: function render(h) {
        var props = getProps(this);

        return h(children, { props: props });
      },
      data: function data() {
        var state = getStates(this, mapStateToProps);
        var actions = getActions(this, mapActionsToProps);
        var merged = mergeProps(state, actions);
        var propNames = Object.keys(merged);

        return _extends({}, merged, {
          vuaReduxPropNames: propNames
        });
      },
      created: function created() {
        var _this = this;

        var store = getStore(this);

        this.vuaReduxUnsubscribe = store.subscribe(function () {
          var state = getStates(_this, mapStateToProps);
          var actions = getActions(_this, mapActionsToProps);
          var merged = mergeProps(state, actions);
          var propNames = Object.keys(merged);
          _this.vuaReduxPropNames = propNames;

          for (var ii = 0; ii < propNames.length; ii++) {
            _this[propNames[ii]] = merged[propNames[ii]];
          }
        });
      },
      beforeDestroy: function beforeDestroy() {
        this.vuaReduxUnsubscribe();
      }
    };
  };
}