import {
  padEvent,
  IconLibrary,
  IconOptions,
  IconKeypad,
  MenuBar,
  MenuBarButton,
} from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { createSub } from '../../common'
import { getOverallLayout } from '../../subs'
import { RunModelButton } from '../control/RunModelButton'
import { getCurrentScenario } from '../../features'

export const MapMenuBar = component(
  'MapMenuBar',
  createSub({
    getCurrentScenario,
    getOverallLayout
  }),
  ({ currentScenario, dispatch }) => (
    <MenuBar>
      <MenuBarButton
        icon={<IconLibrary />}
        title="Scenario"
        onClick={() => dispatch(padEvent.TOGGLE, 'scenarios')}
      >
        {R.propOr('-', 'name', currentScenario)}
      </MenuBarButton>
      <MenuBarButton
        icon={<IconOptions />}
        title="Edit Manager"
        onClick={() => {
          dispatch(padEvent.TOGGLE, 'editManager')
        }}
      >
        Manage edits
      </MenuBarButton>
      {/*<RunModelButton />*/}
      <MenuBarButton
        icon={<IconKeypad />}
        title="Map Legend"
        onClick={() => {
          dispatch(padEvent.TOGGLE, 'mapLegend')
        }}
      >
        Toggle layers
      </MenuBarButton>
    </MenuBar>
  )
)
