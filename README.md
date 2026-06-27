# vue redux binding higher order component
Vue Redux is tested to work on vue v2 and should be used with vue-jsx, component template string or single-file components. For more on vue-jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx

## Install
install through ``npm i redux-vue --save``

## Initialize
install in your root component

```js
// main.js
import Vue from 'vue';
import { reduxStorePlugin } from 'redux-vue';
import AppStore from './AppStore';
import App from './Component/App';

// install redux-vue
Vue.use(reduxStorePlugin);

new Vue({
    store: AppStore,
    render(h) {
    	return <App />
	}
});
```

```js
// store.js
import { createStore } from 'redux';

const initialState = {
  todos: []
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.data.todo]
      }

    default:
      return state;
    }
}

const AppStore = createStore(reducer);

export default AppStore;
```

## Use in your component
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
		}
	},

	render(h) {
		return <div>
			<ul>
				{this.todos.map(todo => <li>{todo}</li>)}
			</ul>

			<div>
				<input type="text" ref="input" />
				<button on-click={this.handleAddTodo}>add todo</button>
			</div>
		</div>
	}
};

function mapStateToProps(state) {
	return {
		todos: state.todos
	};
}

function mapActionToProps(dispatch) {
	return {
		addTodo(todo) {
			dispatch({
				type: 'ADD_TODO',
				data: { todo }
			})
		}
	}
}

export default connect(mapStateToProps, mapActionToProps)(App);

```

## If you prefer to use single-file components
```js
// components/Comp.js
<template>
  <div>
    Hello world!
  </div>
</template>

<script>
export default {
  name: 'my-comp',
}
</script>

<style >
</style>
```

```js
// components/App.js
import { connect } from 'redux-vue'

import Comp from './Comp'


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Comp)
```

## API

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps])(Component)`

Connects a Vue component to a Redux store.

**Arguments**

- `mapStateToProps(state, [ownAttrs]) => Object` — subscribes the component to store updates. Return value is merged into the component's props.
- `mapDispatchToProps(dispatch) => Object` — result is merged into the component's props.
- `mergeProps(stateProps, dispatchProps) => Object` _(optional)_ — if provided, receives the results of the two mappers and its return value is used as the final props object. Useful for combining or renaming keys before they reach the child.

**Unmapped props (pass-through)**

Any props passed to the connected component that are not declared in `mapStateToProps` or `mapDispatchToProps` are forwarded to the wrapped component automatically.

```js
// nonMappedProp is not in mapStateToProps — it still reaches App
<ConnectedApp nonMappedProp="Foo" />
```

**Slots**

Slots defined on the connected component are forwarded to the wrapped component.

```js
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
