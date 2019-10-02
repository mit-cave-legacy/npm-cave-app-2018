import {
  regCoreFeature,
  regDataFeature,
  regMapFeature,
  regModelFeature,
  regScenarioFeature,
  regPadFeature,
  regRouteFeature,
  regSessionFeature,
  enforceArgsNotNull
} from 'mit-cave'
import { calcModelInputHash } from '../common'
import { routes } from '../routes'
import { store } from '../store'
import { MAP_LAYERS } from '../views/map/layers'

/* CORE */
export const {
  getDim,
  initApp,
  renderApp
} = regCoreFeature(store)

/* DATA */
export const {
  getBackgroundData,
  getInitialDataReady,
  getIsConnected
} = regDataFeature(store, {})

/* ROUTER */
export const {
  startRouter,
  getRouteArgs,
  getRouteId,
  getRouterQuery,
  RouteNotFound
} = regRouteFeature(store, { routes })

/* PAD */
export const {
  getPad,
  showPad,
  updatePadPos,
  withWiredPadProps
} = regPadFeature(store)

/* SESSION */
export const {
  SESSION_VARS,
  Sessions
} = regSessionFeature(store, { getRouteArgs })

/* MAP */
export const {
  getViewport,
  getLayerVisibility,
  DeckGLOverlay,
  MapControls
} = regMapFeature(store, {
  storeViewportInSession: true,
  getDim,
  layers: MAP_LAYERS
})

/* SCENARIO */
export const {
  getCurrentScenarioSummary,
  getCurrentScenarioId,
  getCurrentScenario,
  getCurrentFullScenario,
  getScenarioSummaryMap,
  getScenarioSummaries,
  getScenarioToAdd,
  getScenarioDetail,
  getCurrentScenarioVersion,
  getRealizedHistory,
  getUndoList,
  getUndoPlayhead,
  getVisibleUndoList
} = regScenarioFeature(store, { SESSION_VARS })

/* MODEL */
export const {
  getLastRunSummary,
  getIsModelRunning,
  getHaveInputsChangedSinceLastRun,
  getModelRunOutput,
  getModelRunProgress
} = regModelFeature(store, {
  getCurrentScenario,
  showPad,
  calcModelInputHash
})

enforceArgsNotNull('features result', {
  RouteNotFound,
  MapControls,
  Sessions
})
