
function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children:[]
		},
	}
}


function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map(child => {
				return typeof child === 'string'? createTextNode(child) : child
			}),
		},
	}
}


// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)



function render(el, container) {
	const dom = el.type === 'TEXT_ELEMENT' 
		? document.createTextNode('') 
		: document.createElement(el.type)
	

	Object.keys(el.props).forEach(key => {
		if(key !== 'children') {
		  dom[key] = el.props[key]
		}
	})

	const children = el.props.children
	children.forEach(child => {
		render(child, dom)
	})

	container.append(dom)
}


// render(App, document.querySelector('#root'))

// ReactDOM.createRoot(document.querySelector('#root')).render(<App />)

// const ReactDOM = {
// 	createRoot(container) {
// 		return {
// 			render(App) {
// 				return render(App, container)
// 			}
// 		}
// 	}
// }

const React = {

	createElement,
	render
}

export default React