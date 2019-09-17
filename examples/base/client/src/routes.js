export const routeIds = {
  ROOT_INCOMPLETE: 'root-incomplete',
  MAP: 'map',
  DASHBOARD_ROOT: 'dashboard-root',
  DASHBOARD: 'dashboard',
  SESSIONS: 'sessions',
  DIFFS: 'diffs',
  SESSION_ROOT: 'session-root'
}
export const routes = [
  {
    id: routeIds.ROOT_INCOMPLETE,
    path: '/',
    action: () => ({
      redirect: ['sessions']
    })
  },
  {
    id: routeIds.SESSION_ROOT,
    path: '/session/:sessionId',
    action: ({ params }) => ({
      redirect: ['map', { sessionId: params.sessionId }]
    })
  },
  {
    id: routeIds.MAP,
    path: '/session/:sessionId/map'
  },
  {
    id: routeIds.DASHBOARD_ROOT,
    path: '/session/:sessionId/dashboard',
    action: ({ params }) => {
      return {
        redirect: [
          'dashboard',
          { sessionId: params.sessionId, dashboardId: 'a' }
        ]
      }
    }
  },
  {
    id: routeIds.DASHBOARD,
    path: '/session/:sessionId/dashboard/:dashboardId'
  },
  {
    id: routeIds.SESSIONS,
    path: '/sessions'
  }
]
