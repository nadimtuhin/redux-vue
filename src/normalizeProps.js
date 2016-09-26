import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

// https://github.com/vuejs/vue/blob/dev/src/util/options.js
export default function normalizeProps(props) {
  var i, val, normalizedProps = {};

  if (isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        normalizedProps[val] = null;
      } else if (val.name) {
        normalizedProps[val.name] = val;
      }
    }
  } else if (isPlainObject(props)) {
    var keys = Object.keys(props);
    i = keys.length;
    while (i--) {
      let key = keys[i];
      val = props[key];
      normalizedProps[key] = props[key];
      if (typeof val === 'function') {
        normalizedProps[key] = { type: val }
      }
    }
  }

  return normalizedProps;
}