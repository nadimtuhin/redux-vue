# vue redux binding higher order component

## Install
install through ``npm i vua-redux --save``

## Initialize
install in your root component

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

```js
// main.js
import Vue from 'vue';
import { reduxStorePlugin } from 'vua-redux';
import AppStore from './AppStore';
import App from './Component/App';

Vue.use(reduxStorePlugin);

new Vue({
    store: AppStore,
    render(h) {
    	return <App />
	}
});
```

## Use in your component
```js
// components/App.js

import { connect } from 'vua-redux';

const App = {
	props: {
		todos: {
			type: Array,
			redux: true
		},
		addTodo: {
			type: Function,
			redux: true
		}
	},
	
	methods: {
		handleAddTodo(e) {
			const todo = e.target.value;
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
