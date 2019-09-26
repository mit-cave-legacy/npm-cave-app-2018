import { Provider } from 'framework-x'
import React from 'react'
import ReactDOM from 'react-dom'

export const createXProvider = ({ dispatch, getState, subscribeToState }) => ({
  children
}) => (
  <Provider
    getState={getState}
    dispatch={dispatch}
    subscribeToState={subscribeToState}
  >
    {children}
  </Provider>
)

export const createRenderApp = xProvider => App =>
  ReactDOM.render(
    React.createElement(xProvider, { children: App }),
    document.getElementById('root')
  )
