let root = null
let nextWorkOfUnit = null 


function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children:[]
		},
	}
}

/** jsx转化vDom */
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map(child => {
				const isTextNode = typeof child === 'string' || typeof child === 'number'
				return isTextNode? createTextNode(child) : child
			}),
		},
	}
}

function render(el, container) {
	nextWorkOfUnit = {
		dom: container,
		props: {
			children: [el]
		}
	} 

	root = nextWorkOfUnit
}


function workLoop(deadline) {

	let shouldYield = false
	if(!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
		shouldYield = deadline.timeRemaining() < 1
	}

	if(!nextWorkOfUnit && root) {
		// 统一提交
		commitRoot() 
	}

	requestIdleCallback(workLoop)
}

function commitRoot() {
	commitWork(root.child)
	root = null
}

function commitWork(fiber) {
	if(!fiber) return

	let fiberParent = fiber.parent
	while(!fiberParent.dom) {
		fiberParent = fiberParent.parent
	}
	 
	if(fiber.dom) {
		fiberParent.dom.append(fiber.dom)
	}
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

/** 创建DOM */
function createDom(type) {
		return  type === 'TEXT_ELEMENT' 
				? document.createTextNode('') 
				: document.createElement(type)
}

function updateProps(dom, props) {
	Object.keys(props).forEach(key => {
		if(key !== 'children') {
			if(key.startsWith('on')) {
				dom.addEventListener(key.slice(2).toLowerCase(), props[key])
			}else {
				dom[key] = props[key]
			}
		}
	})
}

/**
 * 1. child
 * 2. sibling
 * 3. uncle
 * @param {*} fiber 
 */
function initChildren(fiber, children) {

	let prevChild = null
	children.forEach((child, index) => {
		const newFiber = {
			type: child.type,
			props: child.props,
			child: null,
			parent: fiber,
			sibling: null,
			dom: null
		}

		if(index === 0) {
			fiber.child = newFiber
		}else {
			prevChild.sibling = newFiber
		}
		prevChild = newFiber
	})
}

// 处理函数式组件
function updateFunctionComponent(fiber) {
	const children =  [fiber.type(fiber.props)] 
	initChildren(fiber, children)
}

// 处理标签
 function updateHostComponent(fiber) {
	if(!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type))
		updateProps(dom, fiber.props)
	}

	const children = fiber.props.children

	initChildren(fiber, children)
 }

function  performWorkOfUnit(fiber) {
	const isFunctionComponent = typeof fiber.type === 'function'
	if(isFunctionComponent) {
		updateFunctionComponent(fiber)
	}else {
		updateHostComponent(fiber)
	}
	// 4. 返回下一个要执行的任务
	if(fiber.child) {
		return fiber.child
	}

	if(fiber.sibling) {
		return fiber.sibling
	}

	let nextFiber = fiber
	while(nextFiber) {
		if(nextFiber.sibling) return nextFiber.sibling
		nextFiber = nextFiber.parent
	}
}

requestIdleCallback(workLoop)


const React = {
	createElement,
	render
}
export default React
