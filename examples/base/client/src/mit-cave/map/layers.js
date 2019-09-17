import { isPlainObject, updateIn } from '@mit-cave/util'
import { derive } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { Layer } from 'deck.gl'

export const layerType = {
  ARC: 'arc',
  HEXAGON: 'hexagon',
  ICON: 'icon',
  GRID_CELL: 'grid-cell',
  SCATTERPLOT: 'scatterplot',
  SCREEN_GRID: 'screen-grid',
  PATH: 'path',
  POLYGON: 'polygon',
  TEXT: 'text',
  GRID: 'grid',
  POINT_CLOUD: 'point-cloud',
  GEO_JSON: 'geo-json',
  LINE: 'line',
  HEXAGON_CELL: 'hexagon-cell'
}

export const layerClasses = {
  [layerType.ARC]: 'ArcLayer',
  [layerType.GRID_CELL]: 'GridCellLayer',
  [layerType.HEXAGON]: 'HexagonLayer',
  [layerType.LINE]: 'LineLayer',
  [layerType.POLYGON]: 'PolygonLayer',
  [layerType.TEXT]: 'TextLayer',
  [layerType.POINT_CLOUD]: 'PointCloudLayer',
  [layerType.HEXAGON_CELL]: 'HexagonCellLayer',
  [layerType.PATH]: 'PathLayer',
  [layerType.ICON]: 'IconLayer',
  [layerType.SCREEN_GRID]: 'ScreenGridLayer',
  [layerType.GEO_JSON]: 'GeoJsonLayer',
  [layerType.SCATTERPLOT]: 'ScatterplotLayer',
  [layerType.GRID]: 'GridLayer'
}

const defaultLayerClassResolver = (layerType) => {
  const className = R.prop(layerType, layerClasses)
  if (className) return R.prop(className, require('deck.gl'))
}

const toLayerInstance = layerDefinition => {
  const layerType = R.prop('type', layerDefinition)
  const layerClass = defaultLayerClassResolver(layerType)
  if (!layerClass) {
    console.error('Unsupported layer type in JSON layer definition ', layerDefinition)
    throw new Error('Unsupported layer type in JSON layer definition: ' + layerType)
  }
  return new layerClass(layerDefinition)
}

/**
 * makeGetVisibleLayers
 *
 * @param layers - a map of {[layerName]: Layer}.
 * Layer may  be a Framework-X component, Deck.GL Layer, or JSON layer description
 * @param getLayerVisibilityMap - a selector function that returns {[layerName]: boolean}
 * representing whether the `layerName` should be rendered
 * @returns {*} memoized function that produces layer instances  and calls them with the
 * current global state.
 * Marker/DOM layers should be rendered as children of the DeckGL React component in DeckGLOverlay.
 * DeckGL data visualization layers must be provided to the DeckGL React component's `layers` prop.
 */
export const makeGetVisibleLayers = (layers, getLayerVisibilityMap) =>
  derive([R.identity, getLayerVisibilityMap],
    (db, visibleLayers) => {
      // iteration is over all layers to ensure DeckGL renders visibility layer classes correctly
      return Object.entries(layers).reduce((acc, [layerId, getLayerDefinition]) => {
          // data/json representation
          if (isPlainObject(getLayerDefinition)) {
            const layerDefinition = getLayerDefinition
            const { getData } = layerDefinition
            if (R.has('data', layerDefinition)) {
              console.error(JSON.stringify(layerDefinition, null, 2))
              throw new Error('Invariant violation: '
                              + 'Layer definition should have data or getData but not both')
            }
            const withData = R.assoc('data', getData(db), layerDefinition)
            return updateIn(['gl'], R.append(toLayerInstance(withData)), acc)
          }

          // a framework-x component that has a subscription expecting to be
          // called with the global state and returns a DeckGL.Layer or React component
          // Render-only components (without a subscription, or that expect to receive props from a parent)
          // are not supported
          const layerDefinition = getLayerDefinition(db)

          // deckgl instance
          if (layerDefinition instanceof Layer) {
            if (visibleLayers[layerId]) {
              return updateIn(['gl'], R.append(layerDefinition), acc)
            }
            return updateIn(
              ['gl'],
              R.append(new layerDefinition.constructor(Object.assign({}, layerDefinition.props, { visible: false }))),
              acc)
          }

          // a react component (marker/dom layer)
          if (layerDefinition instanceof React.Component
              || typeof layerDefinition === 'function') {
            // return the component to be rendered if it's visible
            if (visibleLayers[layerId]) {
              return updateIn(['dom'], R.append(layerDefinition), acc)
            } else {
              return null
            }
          }

          throw new Error('Unknown layer definition: Expected DeckGL.Layer, framework-x component, or JSON')
        },
        { dom: [], gl: [] })
    }
  )



