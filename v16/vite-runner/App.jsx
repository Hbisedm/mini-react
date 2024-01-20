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
		return () => {
			console.log('cleanup 0')
		}
	}, [])

	React.useEffect(() => {
		console.log('update count1:', count)
		return () => {
			console.log('cleanup 1, the prev val::', count)
		}
	}, [count])

	React.useEffect(() => {
		console.log('update count2:', count)
		return () => {
			console.log('cleanup 2, the prev val::', count)
		}
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

function Bar(){
	let [bar, setBar] = React.useState(1)

	function handleClick() {
		setBar(++bar)
	}

	return <div>
		i am bar FC
		<div > the bar val: {bar}</div>
		<button onClick={handleClick}>button</button>
	</div>

}

function App() {
	return <div>
		hi
		<Foo></Foo>
		<Bar></Bar>
	</div>
}

export default App