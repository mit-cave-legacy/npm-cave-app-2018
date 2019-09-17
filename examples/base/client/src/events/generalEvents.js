import { coreEvent, mergeOp } from 'mit-cave'
import { routeIds } from '../routes'
import { regEventFx } from '../store'


regEventFx(coreEvent.INITIALIZE_DB, () => ({
  db: mergeOp({
    lastParamsForRoute: {
      [routeIds.DASHBOARD]: {
        dashboardId: 'a'
      }
    },
    sessionVars: {},
    showLayers: {}
  })
}))
