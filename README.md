# redux-vue

Vue Redux binding as a higher-order component. Works with Vue v2 alongside `vue-jsx`, template strings, or single-file components.

## Install

```sh
npm i redux-vue --save
```

## Initialize

Register the plugin in your root component:

```js
// main.js
import Vue from 'vue';
import { reduxStorePlugin } from 'redux-vue';
import AppStore from './AppStore';
import App from './Component/App';

Vue.use(reduxStorePlugin);

new Vue({
  store: AppStore,
  render(h) {
    return <App />;
  },
});
```

Set up your Redux store:

```js
// store.js
import { createStore } from 'redux';

const initialState = {
  todos: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.data.todo],
      };
    default:
      return state;
  }
};

const AppStore = createStore(reducer);

export default AppStore;
```

## Usage

### JSX component

```js
// components/App.js
import { connect } from 'redux-vue';

const App = {
  props: {
    todos: {
      type: Array,
    },
    addTodo: {
      type: Function,
    },
  },

  methods: {
    handleAddTodo() {
      const todo = this.$refs.input.value;
      this.addTodo(todo);
    },
  },

  render(h) {
    return (
      <div>
        <ul>
          {this.todos.map(todo => <li>{todo}</li>)}
        </ul>
        <div>
          <input type="text" ref="input" />
          <button on-click={this.handleAddTodo}>add todo</button>
        </div>
      </div>
    );
  },
};

function mapStateToProps(state) {
  return {
    todos: state.todos,
  };
}

function mapActionToProps(dispatch) {
  return {
    addTodo(todo) {
      dispatch({
        type: 'ADD_TODO',
        data: { todo },
      });
    },
  };
}

export default connect(mapStateToProps, mapActionToProps)(App);
```

### Single-file component

```html
<!-- components/Comp.vue -->
<template>
  <div>Hello world!</div>
</template>

<script>
export default {
  name: 'my-comp',
};
</script>
```

```js
// components/App.js
import { connect } from 'redux-vue';
import Comp from './Comp';

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Comp);
```

## API

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps])(Component)`

Connects a Vue component to a Redux store.

**Arguments**

- `mapStateToProps(state, [ownAttrs]) => Object` — subscribes the component to store updates. Return value is merged into the component's props.
- `mapDispatchToProps(dispatch) => Object` — result is merged into the component's props.
- `mergeProps(stateProps, dispatchProps) => Object` _(optional)_ — receives results of both mappers; its return value becomes the final props object. Useful for combining or renaming keys.

**Pass-through props**

Props passed to the connected component that are absent from both mapper functions are forwarded to the wrapped component automatically.

```html
<!-- nonMappedProp is not in mapStateToProps — it still reaches App -->
<ConnectedApp nonMappedProp="Foo" />
```

**Slots**

Slots defined on the connected component are forwarded to the wrapped component.

```html
<ConnectedApp>
  <span>This slot content is forwarded</span>
</ConnectedApp>
```

**mergeProps example**

```js
const mergeProps = (stateProps, dispatchProps) => ({
  fullCount: stateProps.count * 2,
  onAdd: dispatchProps.addTodo,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
```

## Further reading

- [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)

## License

MIT
