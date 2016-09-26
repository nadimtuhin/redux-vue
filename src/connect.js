import noop from 'lodash/noop';
import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import normalizeProps from './normalizeProps';

export default function connect(mapStateAsProps = noop, mapActionsAsProps = noop) {
    return (children) => {
        const props = children.props || {};
        const subscriptions = children.collect || {};
        
        const allProps = {
            ...normalizeProps(props),
            ...normalizeProps(subscriptions)
        };


        const propsToPass = Object.keys(allProps).map(key => `:${key}='${key}'`).join(' ');
        const template = `<children ${propsToPass}></children>`;

        children.props = allProps;
        delete children.collect;

        return {
            template,
            props: props,

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
