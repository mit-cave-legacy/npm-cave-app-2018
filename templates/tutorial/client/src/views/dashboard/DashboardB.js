import {
  DashboardSideBySideLayout,
  FullScreenContainer
} from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { EnergySankey } from './EnergySankey'
import { FruitsLineChart } from './FruitsLineChart'

export const DashboardB = component('DashboardB', ({ topNav }) => (
  <FullScreenContainer topNav={topNav}>
    <DashboardSideBySideLayout>
      <EnergySankey />
      <FruitsLineChart />
    </DashboardSideBySideLayout>
  </FullScreenContainer>
))
