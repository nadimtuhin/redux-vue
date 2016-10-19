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

        children.props = allProps;
        delete children.collect;

        return {
            name: 'VuaRedux',

            props: props,

            render(h) {
                const keys = Object.keys(allProps);
                let propsToPass = {};
                for (let i = 0; i < keys.length; i++) {
                    propsToPass[keys[i]] = this[keys[i]];
                }

                return h(children, {
                    props: propsToPass
                })
            },

            data() {
                const store = this.$store;
                const state = mapStateAsProps(store.getState()) || {};
                const actions = mapActionsAsProps(store.dispatch, store.getState) || {};

                return {
                    ...state,
                    ...actions
                };
            },

            created() {
                const store = this.$store;
                const state = mapStateAsProps(store.getState()) || {};
                const stateNames = Object.keys(state);

                this.unsubscribe = store.subscribe(() => {
                    const state = mapStateAsProps(store.getState());

                    for (let i = 0; i < stateNames.length; i++) {
                        this[stateNames[i]] = state[stateNames[i]];
                    }
                });
            },

            beforeDestroy() {
                this.unsubscribe();
            }
        };
    };
}
