export default function reduxStorePlugin(Vue, storeId = 'store') {
    Vue.mixin({
        beforeCreate() {
            const options = this.$options;
            // store injection
            if (options[storeId]) {
                this.$store = options.store;
            } else if (options.parent && options.parent.$store) {
                this.$store = options.parent.$store;
            }
        }
    });
}
