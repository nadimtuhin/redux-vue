# vue redux binding higher order component
Vua Redux is tested to work on vue v2 and should be used with vue-jsx or in component template string. For more on vue-jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx

## Install
install through ``npm i vua-redux --save``

## Initialize
install in your root component

```js
// main.js
import Vue from 'vue';
import { reduxStorePlugin } from 'vua-redux';
import AppStore from './AppStore';
import App from './Component/App';

// install vua-redux
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

cosnt initialState = { 
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

import { connect } from 'vua-redux';

const App = {
	props: ['some-prop', 'another-prop'],

	/**
	 * everything you do with vue component props
	 * you can do inside collect key
	 */
	collect: {
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
	}.

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

function mapStateAsProps(state) {
	return {
		todos: state.todos
	};
}

function mapActionAsProps(dispatch) {
	return {
		addTodo(todo) {
			dispatch({
				type: 'ADD_TODO',
				data: { todo }
			})
		}
	}
}

export default connect(mapStateAsProps, mapActionsAsProps)(App);

```
