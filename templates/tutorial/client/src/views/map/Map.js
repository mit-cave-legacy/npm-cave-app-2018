import { mapEvent } from 'mit-cave'
import { component } from 'framework-x'
import { Div } from 'glamorous'
import React from 'react'
import MapGL from 'react-map-gl'
import { getMapStyle } from '../../app/selectors'
import { createSub } from '../../common/reselect'
import { getViewport, getIsConnected } from '../../features'
import { GroundRadial } from '../control/GroundRadial'
import { ControlOverlay } from './ControlOverlay'
import { DeckGLOverlay } from '../../features'

const MAPBOX_TOKEN = process.env.MapboxAccessToken // eslint-disable-line

export default component(
  'Map',
  createSub({
    getMapStyle,
    getViewport,
    getIsConnected,
  }),
  ({  viewport, mapStyle, isConnected,  dispatch }) => (
    <Div>
      <MapGL
        {...viewport}
        mapStyle={mapStyle}
        onViewportChange={viewport =>
          dispatch(mapEvent.VIEWPORT_CHANGED, viewport)
        }
        mapboxApiAccessToken={MAPBOX_TOKEN}
        maxPitch={59.9}
        touchRotate
      >
        <DeckGLOverlay />
        <GroundRadial />
      </MapGL>
      {isConnected && <ControlOverlay />}
    </Div>
  )
)
