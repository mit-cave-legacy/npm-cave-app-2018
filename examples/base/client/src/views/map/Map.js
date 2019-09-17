import { mapEvent } from 'mit-cave'
import { component } from 'framework-x'
import { Div } from 'glamorous'
import React from 'react'
import MapGL from 'react-map-gl'
import { createSub } from '../../common/reselect'
import { getViewport, getIsConnected } from '../../features'
import { GroundRadial } from '../control/GroundRadial'
import { ControlOverlay } from './ControlOverlay'
import { DeckGLOverlay } from '../../features'

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken

export default component(
  'Map',
  createSub({
    getViewport,
    getIsConnected,
  }),
  ({  viewport, isConnected,  dispatch }) => (
    <Div>
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
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
