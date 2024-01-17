import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')
let count = 1

let props = {id: '1'}

export function Counter({num}) {
	function handleClick() {
		console.log('onclick')
		count++
		props = {}
		React.update()
	}
	return <div {...props}>
		count:{num}
		count:{count}
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