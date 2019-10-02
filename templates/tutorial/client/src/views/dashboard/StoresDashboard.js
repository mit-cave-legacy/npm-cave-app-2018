import { FullScreenContainer } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { StoresChart } from './StoresStackedBarChart'

export const StoresDashboard = component('StoresDashboard', ({ topNav }) => (
  <FullScreenContainer topNav={topNav}>
    <StoresChart />
  </FullScreenContainer>
))
