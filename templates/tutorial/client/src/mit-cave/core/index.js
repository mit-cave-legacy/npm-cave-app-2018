import * as R from 'ramda'
import { mergeOp } from 'mit-cave/util'
import { coreEvent } from './event'
import { createRenderApp, createXProvider } from './view'

export { coreEvent }

export const regCoreFeature = ({
  dispatch,
  getState,
  regEventFx,
  regFx,
  subscribeToState
}) => {
  /* SELECTORS */
  const getDim = R.prop('dim')

  /* WINDOW SIZE */
  const onWindowResized = () =>
    dispatch(coreEvent.WINDOW_RESIZED, {
      width: window.innerWidth,
      height: window.innerHeight
    })
  window.addEventListener('resize', onWindowResized)

  /* EVENTS */
  regEventFx(coreEvent.INITIALIZE_DB, _ => ({
    db: mergeOp({
      dim: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }))
  regEventFx(coreEvent.WINDOW_RESIZED, (__, _, dim) => ({
    db: R.pipe(
      R.assoc('dim', dim),
      R.assoc('pads', {})
    )
  }))

  /* Generic change events */
  regEventFx(coreEvent.CHANGE_VALUE, (_, __, [pathOrProp, value]) => {
    const op = R.is(Array, pathOrProp) ? R.assocPath : R.assoc
    return {
      db: op(pathOrProp, value)
    }
  })
  regEventFx(coreEvent.TOGGLE_VALUE, ({ db }, __, pathOrProp) => {
    const path = R.is(Array, pathOrProp) ? pathOrProp : [pathOrProp]
    return {
      db: R.assocPath(path, !R.path(path, db))
    }
  })

  const XProvider = createXProvider({ dispatch, getState, subscribeToState })
  const renderApp = createRenderApp(XProvider)

  return {
    initApp: () => dispatch(coreEvent.INITIALIZE_DB),
    getDim,
    XProvider,
    renderApp
  }
}
