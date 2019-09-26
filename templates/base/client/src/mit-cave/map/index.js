import { derive } from 'framework-x'
import * as R from 'ramda'
import { coreEvent } from '@mit-cave/core'
import { SESSION_VARS, sessionEvent } from '@mit-cave/session'
import { enforceArgsNotNull } from '@mit-cave/util'
import { DEFAULT_MAP_HOME_VIEWPORT } from './constants'

import { mapEvent } from './event'
import { makeGetVisibleLayers } from './layers'
import { createViews } from './view'


export { mapEvent }

const updateViewportShared = viewport => ({
  db: R.assocPath([SESSION_VARS, 'viewport'], viewport),
  emit: [
    sessionEvent.CHANGE_VAR,
    {
      varName: 'viewport',
      value: R.pipe(
        R.toPairs(),
        R.reject(([key]) => key.startsWith('transition')),
        R.fromPairs()
      )(viewport)
    }
  ]
})
const updateViewportLocal = viewport => ({
  db: R.assocPath(['map', 'viewport'], viewport)
})

/**
 *
 * @param regEventFx
 * @param homeViewport
 * @param storeViewportInSession
 * @param getDim
 * @param layers - Map of {[layerName]: Layer} to render
 * @returns {{getViewport: *, getShowPitchSlider: *, PitchSlider: *, DeckGLOverlay: *, getLayerVisibility: *, MapControls: *}}
 */
export const regMapFeature = (
  { regEventFx },
  {
    homeViewport = DEFAULT_MAP_HOME_VIEWPORT,
    storeViewportInSession = false,
    getDim,
    layers
  } = {}
) => {
  enforceArgsNotNull({
    getDim,
    layers
  })

  /* SELECTORS */
  const getRawViewport = storeViewportInSession
    ? R.path([SESSION_VARS, 'viewport'])
    : R.path(['map', 'viewport'])

  const getViewport = derive([getRawViewport, getDim], (raw, dim) =>
    R.merge(raw, dim)
  )

  const getLayerVisibility = R.propOr(false, 'showLayers')
  const getVisibleLayers = makeGetVisibleLayers(layers, getLayerVisibility)
  const getShowPitchSlider = R.pathOr(false, ['map', 'showPitchSlider'])
  /* Event handling */

  const updateViewport = storeViewportInSession
    ? updateViewportShared
    : updateViewportLocal

  regEventFx(coreEvent.INITIALIZE_DB, () => updateViewport(homeViewport))

  regEventFx(mapEvent.VIEWPORT_CHANGED, (__, _, viewport) => updateViewport(viewport))

  regEventFx(mapEvent.HOME, () => updateViewport(homeViewport))

  const updateZoom = (updater, db) => {
    const viewport = getViewport(db)
    const zoom = updater(R.prop('zoom', viewport))
    return updateViewport({
      ...viewport,
      zoom
    })
  }
  regEventFx(mapEvent.ZOOM_IN, ({ db }) => updateZoom(R.inc, db))
  regEventFx(mapEvent.ZOOM_OUT, ({ db }) => updateZoom(R.dec, db))
  regEventFx(mapEvent.CHANGE_PITCH, ({ db }, _, pitch) => {
    const viewport = getViewport(db)
    return updateViewport({
      ...viewport,
      pitch
    })
  })

  regEventFx(mapEvent.CHANGE_LAYER_VISIBILITY, (__, _, [layer, visible]) => ({
    db: R.assocPath(['showLayers', layer], visible)
  }))

  regEventFx(mapEvent.OPEN_CONTEXT_MENU, (__, _, lngLat) => ({
    db: R.assoc('groundRadial', {
      isOpen: true,
      lngLat
    })
  }))

  regEventFx(mapEvent.CLOSE_CONTEXT_MENU, () => ({
    db: R.dissoc('groundRadial')
  }))


  const { PitchSlider, MapControls, DeckGLOverlay } = createViews({
    getShowPitchSlider,
    getViewport,
    getVisibleLayers
  })

  return {
    getShowPitchSlider,
    getViewport,
    getLayerVisibility,
    PitchSlider,
    MapControls,
    DeckGLOverlay,
  }
}
