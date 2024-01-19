import React from './React.js'

const ReactDOM = {
	createRoot(container) {
		return {
			render(App) {
				return React.render(App, container)
			}
		}
	}
}

export default ReactDOM