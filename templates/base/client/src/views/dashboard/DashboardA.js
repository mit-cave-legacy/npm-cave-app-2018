import { DashboardQuadLayout, FullScreenContainer } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { EnergySankey } from './EnergySankey'
import { FruitsLineChart } from './FruitsLineChart'
import { ZipBarSeries } from './ZipBarSeries'

export const DashboardA = component('DashboardA', ({ topNav }) => (
  <FullScreenContainer topNav={topNav}>
    <DashboardQuadLayout>
      <ZipBarSeries />
      <EnergySankey />
      <FruitsLineChart />
    </DashboardQuadLayout>
  </FullScreenContainer>
))
