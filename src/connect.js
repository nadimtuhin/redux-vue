import noop from 'lodash/noop';
import omitBy from 'lodash/omitBy';

export default function connect(mapStateAsProps = noop, mapActionsAsProps = noop) {
    return (children) => {
        /** @namespace children.collect */
        const props = children.props || {};
        const propsToPass = Object.keys(props).map(key => `:${key}='${key}'`).join(' ');
        const template = `<children ${propsToPass}></children>`;

        return {
            template,
            props: omitBy(props, prop => prop.redux),

            data() {
                const store = this.$store;
                const state = mapStateAsProps(store.getState()) || {};
                const actions = mapActionsAsProps(store.dispatch, store.getState) || {};

                return {
                    ...state,
                    ...actions
                };
            },

            components: {
                children
            },

            created() {
                const store = this.$store;
                const state = mapStateAsProps(store.getState()) || {};
                const stateNames = Object.keys(state);

                this.unsubscribe = store.subscribe(() => {
                    const state = mapStateAsProps(store.getState());

                    stateNames.forEach((key) => { // fixme: use a simple loop
                        this[key] = state[key];
                    });
                });
            },

            destroyed() {
                this.unsubscribe();
            }
        };
    };
}
