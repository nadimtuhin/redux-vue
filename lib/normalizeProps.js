'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeProps;

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/vuejs/vue/blob/dev/src/util/options.js
function normalizeProps(props) {
  var i,
      val,
      normalizedProps = {};

  if ((0, _isArray2.default)(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        normalizedProps[val] = null;
      } else if (val.name) {
        normalizedProps[val.name] = val;
      }
    }
  } else if ((0, _isPlainObject2.default)(props)) {
    var keys = Object.keys(props);
    i = keys.length;
    while (i--) {
      var key = keys[i];
      val = props[key];
      normalizedProps[key] = props[key];
      if (typeof val === 'function') {
        normalizedProps[key] = { type: val };
      }
    }
  }

  return normalizedProps;
}