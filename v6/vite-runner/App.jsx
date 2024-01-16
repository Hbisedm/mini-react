import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')

function Counter({num}) {
	return <div>counter:{num}</div>
}

function CounterContainer() {
	return <Counter></Counter>
}

function App() {
	return <div>
		hi
		<Counter num={99}></Counter>
		<Counter num={22}></Counter>
	</div>
}

export default App