import React from './core/React.js'

// const App =  React.createElement('div', {id:'app'}, 'app')
function Foo() {
	console.log('re foo fc')
	const [count, setCount] = React.useState(1)
	const [bar, setBar] = React.useState('bar')

	function handleClick() {
		setCount((c) => c+ 1)
		setBar('bar')
	}

	React.useEffect(() => {
		console.log('init')
	}, [])

	React.useEffect(() => {
		console.log('update count:', count)
	}, [count])

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