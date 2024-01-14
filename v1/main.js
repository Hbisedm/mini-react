// v1
// const dom = document.createElement('div')
// dom.setAttribute('id', 'app')
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = 'app'
// dom.append(textNode)


// v2 react -> vdom -> js object

import ReactDOM from './core/ReactDom.js'
import App from './App.js'


ReactDOM.createRoot(document.querySelector('#root')).render(App)