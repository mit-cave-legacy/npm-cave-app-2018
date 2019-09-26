import { DisconnectedMask, theme } from 'mit-cave'
import { component } from 'framework-x'
import { Div } from 'glamorous'
import React from 'react'
import { createSub } from '../common'
import {
  getRouteArgs,
  getRouteId,
  RouteNotFound,
  Sessions,
  getInitialDataReady,
  getIsConnected
} from '../features'
import { routeIds } from '../routes'
import { Dashboard } from './dashboard/Dashboard'
import Map from './map/Map'
import { FlatNav } from './Nav'

const invoke = fn => fn()

const App = component(
  'App',
  createSub({
    getInitialDataReady,
    getRouteId,
    getRouteArgs,
    getIsConnected
  }),
  ({ routeId, isConnected }) => (
    <Div
      css={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.radiantGraphite,
        color: theme.offWhite
      }}
    >
      <FlatNav visible={routeId !== routeIds.SESSIONS} />
      {invoke(() => {
        switch (routeId) {
          case routeIds.DASHBOARD:
            return <Dashboard />
          case routeIds.MAP:
            return <Map />
          case routeIds.SESSIONS:
            return <Sessions />
          default:
            return <RouteNotFound />
        }
      })}
      {!isConnected && <DisconnectedMask />}
    </Div>
  )
)
export default App
