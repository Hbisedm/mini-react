import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')
let showBar = false
export function Counter() {
	const bar = <div>bar</div>

	function handleClick() {
		showBar = !showBar
		React.update()
	}

	return <div>
		count:
		{showBar && bar}
		<button onClick={handleClick}>showBar</button>
	</div>
}


function App() {
	return <div>
		hi
		<Counter></Counter>
	</div>
}

export default App