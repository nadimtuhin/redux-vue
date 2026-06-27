# redux-vue

[![CI](https://github.com/nadimtuhin/redux-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/nadimtuhin/redux-vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/redux-vue.svg)](https://www.npmjs.com/package/redux-vue)
[![npm downloads](https://img.shields.io/npm/dm/redux-vue.svg)](https://www.npmjs.com/package/redux-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Redux bindings for **Vue 2** — a higher-order component (HOC) that connects Vue
components to a Redux store, similar to `react-redux`'s `connect()`.

> **Vue 2 only.** This library targets Vue 2.x. For Vue 3, use Pinia or `vuex` 4.x.

---

## Install

```bash
npm install redux-vue
# or
yarn add redux-vue
```

## Setup

Register the plugin on your root Vue instance so all child components can access
the store:

```js
// main.js
import Vue from 'vue';
import { reduxStorePlugin } from 'redux-vue';
import store from './store';
import App from './App';

Vue.use(reduxStorePlugin);

new Vue({
  store,
  render: h => h(App),
});
```

## Usage

### `connect(mapStateToProps, mapDispatchToProps, [mergeProps])(Component)`

Wraps a Vue component and injects store state and dispatch functions as props.

```js
// components/TodoApp.js
import { connect } from 'redux-vue';

const TodoApp = {
  props: {
    todos: { type: Array },
    addTodo: { type: Function },
  },
  render(h) {
    return (
      <div>
        <ul>{this.todos.map(t => <li>{t}</li>)}</ul>
        <button onClick={() => this.addTodo('new item')}>Add</button>
      </div>
    );
  },
};

const mapStateToProps = state => ({ todos: state.todos });

const mapDispatchToProps = dispatch => ({
  addTodo: todo => dispatch({ type: 'ADD_TODO', payload: todo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

### Single-file components

```js
// components/App.js
import { connect } from 'redux-vue';
import Comp from './Comp.vue';

const mapStateToProps = state => ({ count: state.count });
const mapDispatchToProps = dispatch => ({
  increment: () => dispatch({ type: 'INCREMENT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Comp);
```

---

## API

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps])(Component)`

| Argument                                | Type                  | Description                                              |
| --------------------------------------- | --------------------- | -------------------------------------------------------- |
| `mapStateToProps(state, ownAttrs)`      | Function              | Maps store state to props. Called on every store update. |
| `mapDispatchToProps(dispatch)`          | Function              | Maps dispatch calls to props.                            |
| `mergeProps(stateProps, dispatchProps)` | Function _(optional)_ | Combine or rename keys before they reach the child.      |

**Pass-through props** — props not declared in the map functions are forwarded to
the wrapped component automatically.

**Slots** — slot content on the connected wrapper is forwarded to the inner component.

### `reduxStorePlugin`

A Vue plugin. Call `Vue.use(reduxStorePlugin)` once with `store` set on the root
instance. All descendant components will have `this.$store` available.

---

## Examples

### `mergeProps`

```js
const mergeProps = (stateProps, dispatchProps) => ({
  fullCount: stateProps.count * 2,
  onAdd: dispatchProps.addTodo,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
```

### Pass-through props

```html
<!-- nonMappedProp is not in mapStateToProps — it still reaches the wrapped component -->
<ConnectedApp nonMappedProp="Foo" />
```

### Slots

```html
<ConnectedApp>
  <span>This slot content is forwarded to the inner component</span>
</ConnectedApp>
```

---

## Store example

```js
// store.js
import { createStore } from 'redux';

const initialState = { todos: [] };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
};

export default createStore(reducer);
```

---

## Development

```bash
git clone https://github.com/nadimtuhin/redux-vue.git
cd redux-vue
npm install
npm test
```

Tests live in `src/*.spec.js` and use Mocha. See [CONTRIBUTING.md](CONTRIBUTING.md)
for contribution guidelines.

---

## License

[MIT](LICENSE) © Nadim Tuhin
