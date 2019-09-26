import { storiesOf } from '@storybook/react'
import React from 'react'
import { css } from 'react-emotion'
import { CaveLogo } from '../icons/CaveLogo'
import { compound } from '../storyConsts'
import { radiantGraphite } from '../theme'
import { FloatingHeader } from './FloatingHeader'
import { NavigationTab, TabSelector } from './Navigator'

const backgroundStyle = css({
  backgroundColor: radiantGraphite,
  width: '100vw',
  height: '100vh'
})
storiesOf(compound('FloatingHeader'), module).add('Default', () => (
  <div className={backgroundStyle}>
    <FloatingHeader className={css({ color: 'white' })}>
      <CaveLogo />
      <TabSelector value="b">
        <NavigationTab value="a">Dashboard A</NavigationTab>
        <NavigationTab value="b">Dashboard B</NavigationTab>
        <NavigationTab value="charts">Charts</NavigationTab>
      </TabSelector>
      <TabSelector>
        <NavigationTab value="settings">Settings</NavigationTab>
      </TabSelector>
    </FloatingHeader>
  </div>
))
