import { storiesOf } from '@storybook/react'
import React from 'react'
import styled, { css } from 'react-emotion'
import { DashboardQuadLayout, FullScreenContainer } from './Layouts'
import { chart } from './storyConsts'
import { radiantGraphite } from './theme'

const backgroundStyle = css({
  backgroundColor: radiantGraphite,
  width: '100%',
  height: '100vh'
})
const Placeholder = styled('div')({
  // border: standardBorder,
})
storiesOf(chart('DashboardQuadLayout'), module).add('Default', () => (
  <div className={backgroundStyle}>
    <FullScreenContainer>
      <DashboardQuadLayout>
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </DashboardQuadLayout>
    </FullScreenContainer>
  </div>
))
