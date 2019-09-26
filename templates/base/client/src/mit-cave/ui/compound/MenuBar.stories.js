import { storiesOf } from '@storybook/react'
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { css } from 'react-emotion'
import { IconCalculate, IconLibrary, IconMap } from '../icons'
import { compound } from '../storyConsts'
import { px, radiantGraphite } from '../theme'
import { BottomLeft } from './ControlLayout'
import { MenuBar, MenuBarButton, PopupAnchor } from './MenuBar'

const backgroundStyle = css({
  backgroundColor: radiantGraphite,
  width: '100vw',
  height: '100vh'
})
storiesOf(compound('MenuBar'), module).add('BottomLeft', () => (
  <div className={backgroundStyle}>
    <BottomLeft css={{ left: px(10) }}>
      <MenuBar>
        <MenuBarButton icon={<IconMap />} title="Map Layer">
          Default
        </MenuBarButton>
        <MenuBarButton icon={<IconLibrary />} title="Scenario">
          San Francisco - 2017
        </MenuBarButton>
        <MenuBarButton disabled icon={<IconCalculate />} title="Run Model">
          Disabled
        </MenuBarButton>
        <MenuBarButton icon={<IconCalculate />} title="Run Model">
          Last run 19 days
        </MenuBarButton>
      </MenuBar>
    </BottomLeft>
  </div>
))
