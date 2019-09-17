import { createDevServer, createStore } from 'server-fx'
import { isProduction } from './config'
import { sevt } from './serverEventTypes'


/**
 * Uncomment to enable inspection of server-fx events with [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
 */
// let devToolMiddleware
// if (!isProduction) {
//   devToolMiddleware = createDevServer().reduxDevTools
// }

export const { regFx, regEventFx, dispatch, configureIo } = createStore({
  // middlewares: [devToolMiddleware],
  serverEvents: sevt
})
