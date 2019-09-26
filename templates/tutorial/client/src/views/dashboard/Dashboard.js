import { theme } from 'mit-cave'
import { component } from 'framework-x'
import { Div } from 'glamorous'
import * as R from 'ramda'
import React from 'react'
import { createSub } from '../../common'
import { derive } from '../../common/reselect'
import { getOverallLayout } from '../../subs'
import { DashboardA } from './DashboardA'
import { DashboardB } from './DashboardB'
import { getRouteArgs } from '../../features'

const switchDashboard = (dashboardId, topNav) => {
  switch (dashboardId) {
    case 'a':
      return <DashboardA topNav={topNav} />
    case 'b':
      return <DashboardB topNav={topNav} />
    default:
      return `Dashboard "${dashboardId}" not found`
  }
}

export const Dashboard = component(
  'Dashboard',
  createSub({
    getRouteArgs,
    getTopNav: derive(getOverallLayout, R.equals('top'))
  }),
  ({ routeArgs, topNav }) => (
    <Div>
      <Div
        css={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundColor: theme.radiantGraphite
        }}
      >
        {switchDashboard(routeArgs.dashboardId, topNav)}
      </Div>
    </Div>
  )
)
