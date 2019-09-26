import { component, derive } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { DeckGL } from 'deck.gl'
import { css } from 'react-emotion'
import {
  IconLocate,
  IconMinus,
  IconPlus,
  IconPitch,
  MenuBar,
  px,
  PitchSlider
} from 'mit-cave/ui'
import { coreEvent } from 'mit-cave/core'
import { createSub, enforceArgsNotNull } from 'mit-cave/util'
import { mapEvent } from './event'

export const createViews = ({
  getShowPitchSlider,
  getViewport,
  getVisibleLayers
}) => {
  enforceArgsNotNull('createViews', {
    getShowPitchSlider,
    getViewport
  })

  const DeckGLOverlay = component(
    'DeckGLOverlay',
    createSub({
      getViewport,
      getVisibleLayers
    }),
    ({ viewport, visibleLayers: { dom, gl } }) => {
      return (
        <React.Fragment>
          <DeckGL {...viewport}
                  layers={gl} />
          {dom}
        </React.Fragment>
      )
    }
  )

  const MapControlOption = ({ children, ...props }) => (
    <div
      className={css({
        height: px(48),
        maxHeight: px(48),
        minHeight: px(48),
        width: px(50),
        minWidth: px(50),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      })}
      {...props}
    >
      {children}
    </div>
  )

  const PitchControl = component(
    'PitchControl',
    createSub({
      pitch: derive(getViewport, R.prop('pitch'))
    }),
    ({ pitch, minPitch = 1, maxPitch = 60, dispatch }) => (
      <div
        css={{
          position: 'absolute',
          bottom: px(70)
        }}
      >
        <PitchSlider
          value={pitch}
          min={minPitch}
          max={maxPitch}
          onChange={pitch => dispatch(mapEvent.CHANGE_PITCH, pitch)}
        />
      </div>
    )
  )

  const MapControls = component(
    'MapControls',
    createSub({
      showPitchSlider: getShowPitchSlider
    }),
    ({ showPitchSlider, dispatch }) => (
      <MenuBar>
        <MapControlOption
          onClick={() => {
            dispatch(mapEvent.HOME)
          }}
        >
          <IconLocate />
        </MapControlOption>
        <MapControlOption
          onClick={() => {
            dispatch(mapEvent.ZOOM_IN)
          }}
        >
          <IconPlus />
        </MapControlOption>
        <MapControlOption
          onClick={() => {
            dispatch(mapEvent.ZOOM_OUT)
          }}
        >
          <IconMinus />
        </MapControlOption>
        <MapControlOption>
          {showPitchSlider && <PitchControl />}
          <div
            css={{
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={() => {
              dispatch(coreEvent.TOGGLE_VALUE, ['map', 'showPitchSlider'])
            }}
          >
            <IconPitch />
          </div>
        </MapControlOption>
      </MenuBar>
    )
  )

  return {
    PitchSlider, //todo. this is being re-exported from cave-ui
    MapControls,
    DeckGLOverlay
  }
}
