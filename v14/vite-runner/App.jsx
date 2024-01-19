import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')
function Foo() {
	const [count, setCount] = React.useState(1)
	const [bar, setBar] = React.useState('bar')

	function handleClick() {
		setCount((c) => c+ 1)
		setBar('bar')
	}

	return (
		<div>
			<h1>foo</h1>
			{count}
			<div>{bar}</div>
			<button onClick={handleClick}>click</button>
		</div>
	)
}

function App() {
	return <div>
		hi
		<Foo></Foo>
	</div>
}

export default App