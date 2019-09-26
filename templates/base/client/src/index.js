import { Provider } from 'framework-x'
import React from 'react'
import './events'
import ReactDOM from 'react-dom'
import { initApp, startRouter } from './features'
import './index.css'
import { getState, dispatch, subscribeToState } from './store'
import App from './views/App'

initApp()
startRouter()

ReactDOM.render(
  <Provider
    getState={getState}
    dispatch={dispatch}
    subscribeToState={subscribeToState}
  >
    <App />
  </Provider>,
  document.getElementById('root')
)
