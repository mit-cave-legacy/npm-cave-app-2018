import { BottomCenter, BottomRight, px } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { css } from 'react-emotion'
import { MapControls } from '../../features'
import { EditManager } from '../control/EditManager'
import { MapMenuBar } from '../control/MapMenuBar'
import { MapLegend } from '../control/MapLegend'
import { RunModelOutput } from '../control/RunModelOutput'
import { ScenarioLibrary } from '../control/ScenarioLibrary'


export const ControlOverlay = component('ControlOverlay', () => (
  <div>
    <BottomCenter>
      <MapMenuBar />
    </BottomCenter>
    <BottomRight
      className={css({
        right: px(16)
      })}
    >
      <MapControls />
    </BottomRight>
    <MapLegend />
    <ScenarioLibrary />
    <RunModelOutput />
    <EditManager />
  </div>
))
