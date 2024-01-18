// work in progress 工作中的节点
let wipRoot = null
let currentRoot = null
let nextWorkOfUnit = null 
let deletions = []


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
	wipRoot = {
		dom: container,
		props: {
			children: [el]
		}
	} 

	nextWorkOfUnit = wipRoot
}


function workLoop(deadline) {

	let shouldYield = false
	if(!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
		shouldYield = deadline.timeRemaining() < 1
	}

	/** !nextWorkOfUnit => 保证所有的fiber都处理好了 */
	if(!nextWorkOfUnit && wipRoot) {
		// 统一提交
		commitRoot() 
	}

	requestIdleCallback(workLoop)
}

function commitRoot() {
	deletions.forEach(commitDeletion)
	commitWork(wipRoot.child)
	currentRoot = wipRoot // 保证下次更新有值
	wipRoot = null
	deletions = []
}

function commitDeletion(fiber){
	if(fiber.dom) {
		let fiberParent = fiber.parent
		while(!fiberParent.dom) {
			fiberParent = fiberParent.parent
		}
		fiberParent.dom.removeChild(fiber.dom)
	}else {
		commitDeletion(fiber.child)
	}
}

function commitWork(fiber) {
	if(!fiber) return

	let fiberParent = fiber.parent

	while(!fiberParent.dom) {
		fiberParent = fiberParent.parent
	}
	if(fiber.effectTag === 'update') {
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
	}else if(fiber.effectTag === 'placement'){
		if(fiber.dom) {
			fiberParent.dom.append(fiber.dom)
		}
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

function updateProps(dom, nextProps, prevProps) {

	// 1. old 有 new 没有 删除
	Object.keys(prevProps).forEach(key => {
		if(key !== 'children') {
			if(!(key in nextProps)) {
				dom.removeAttribute(key)
			}
		}
	}) 
	// 2. new 有 old 没有 添加
	// 3. new 有 old 有 更新
	Object.keys(nextProps).forEach(key => {
		if(key !== 'children') {
			if(prevProps[key] !== nextProps[key]) {
				if(key.startsWith('on')) {
					const eventType = key.slice(2).toLowerCase()
					dom.removeEventListener(eventType, prevProps[key])
					dom.addEventListener(eventType, nextProps[key])
				}else {
					dom[key] = nextProps[key]
				}
			}
		}
	}) 
}

/**
 * 调和children
 * 1. child
 * 2. sibling
 * 3. uncle
 * @param {*} fiber 
 */
function reconcileChildren(fiber, children) {

	let oldFiber = fiber.alternate?.child
	let prevChild = null

	children.forEach((child, index) => {

		const isSameType = oldFiber && oldFiber.type === child.type

		let  newFiber
		if(isSameType) {
			// update
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber.dom, //指向老的dom
				effectTag: 'update',
				alternate:oldFiber, //指向老的Fiber 链接
			}
		}else {
			// create
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: null,
				effectTag: 'placement'
			}

			if(oldFiber) {
				// 收集需要删除的节点
				deletions.push(oldFiber)
			}
		}


		/** 如果在更新的话且有多个孩子节点, 那么需要移动oldFiber的指向, 让sibling也应该和老的一样去链接 */
		if(oldFiber) {
			oldFiber = oldFiber.sibling 
		}

		if(index === 0) {
			fiber.child = newFiber
		}else {
			prevChild.sibling = newFiber
		}
		prevChild = newFiber
	})

	// 处理新的比老的少孩子节点的case
	while(oldFiber) {
		deletions.push(oldFiber)
		oldFiber = oldFiber.sibling
	}
}

/** 处理函数式组件 */
function updateFunctionComponent(fiber) {
	const children =  [fiber.type(fiber.props)] 
	reconcileChildren(fiber, children)
}

/** 处理标签 */ 
 function updateHostComponent(fiber) {
	if(!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type))
		updateProps(dom, fiber.props, {})
	}
	const children = fiber.props.children
	reconcileChildren(fiber, children)
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

function update() {
	// 得到新的Dom树结构
	wipRoot = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot
	} 

	nextWorkOfUnit = wipRoot
}

const React = {
	createElement,
	render,
	update
}
export default React
