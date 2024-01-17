import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')

export function Counter({num}) {
	function handleClick() {
		console.log('onclick')
	}
	return <div>
		count:{num}
		<button onClick={handleClick}>onclick</button>

	</div>
}


function App() {
	return <div>
		hi
		<Counter num={99}></Counter>
	</div>
}

export default App