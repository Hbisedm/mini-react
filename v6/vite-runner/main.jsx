import ReactDOM from './core/ReactDom.js'
import React from './core/React.js'
import App, {Counter} from './App.jsx'


ReactDOM.createRoot(document.querySelector('#root')).render(<App></App>)

setTimeout(() => {
	ReactDOM.createRoot(document.querySelector('#root')).render(<Counter num={33}></Counter>)
}, 3000);