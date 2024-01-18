import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')
let showBar = false
export function Counter({num}) {
	const foo = <div>foo</div>
	const bar = <p>bar</p>
	function Foo() {
		return <div>foo fc</div>
	}
	function handleClick() {
		showBar = !showBar
		React.update()
	}
	return <div>
		{/* <div>{showBar? bar: foo}</div> */}
		<div>{showBar? bar: <Foo></Foo>}</div>
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