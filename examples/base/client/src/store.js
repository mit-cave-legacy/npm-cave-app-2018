import { createStore } from 'framework-x'

// const prod = process.env.NODE_ENV === 'production'
export const store = createStore()
window._store = store

const safeDispatch = (...args) => {
  if (typeof args[0] !== 'string')
    throw new Error('attempted to dispatch empty argument!')
  return store.dispatch.apply(null, args)
}
/* Override fix for framework-x */
store.regFx('dispatch', ([type, payload]) => {
  safeDispatch(type, payload)
})

export const { regEventFx, regFx, getState, setState, subscribeToState } = store
export const dispatch = safeDispatch
