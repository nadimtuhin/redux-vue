'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reduxStorePlugin;
function reduxStorePlugin(Vue) {
    var storeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'store';

    Vue.mixin({
        beforeCreate: function beforeCreate() {
            var options = this.$options;
            // store injection
            if (options[storeId]) {
                this.$store = options.store;
            } else if (options.parent && options.parent.$store) {
                this.$store = options.parent.$store;
            }
        }
    });
}