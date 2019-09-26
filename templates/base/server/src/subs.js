import * as R from 'ramda'
import { DEFAULT_MAP_HOME_VIEWPORT } from 'mit-cave'

export const getSelectionsFor = R.curry((db, id) =>
  R.merge(
    { viewport: DEFAULT_MAP_HOME_VIEWPORT },
    R.path(['sessions', id, 'selections'], db)
  )
)
export const getBackgroundData = R.prop('background')
export const getIsModelRunning = state => !!state.modelRun

export const getSessionMetadata = R.pipe(
  R.propOr([], 'sessions'),
  R.map(({ id, selections }) => ({
    id,
    scenarioId: R.prop('scenario', selections)
  }))
)
