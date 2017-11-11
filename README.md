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
	};
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

## connect([mapStateToProps], [mapDispatchToProps], [mergeProps])
Connects a Vue component to a Redux store.
### Arguments
* [mapStateToProps(state, [ownAttrs]): stateProps] (__Function__) Subscribes component to Redux store updates. This means that any time the store is updated, mapStateToProps will be called. The results of `mapStateToProps` must be a plain object, which will be merged into the component’s props.
* [mapDispatchToProps(dispatch): dispatchProps] (__Function__) Result must be a plain object
* [mergeProps(stateProps, dispatchProps): props] (__Function__) If specified, it is passed the result of `mapStateToProps()` and `mapDispatchToProps()`. The plain object you return from it will be passed as props to the wrapped component.
