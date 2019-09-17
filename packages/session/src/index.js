import { derive } from 'framework-x'
import * as R from 'ramda'
import { dataEvent } from '@mit-cave/data'
import { routeEvent } from '@mit-cave/route'
import { createViews } from './view'
import { sessionEvent } from './event'

export { sessionEvent }

export const getSessionIdFor = (db, socketId) =>
  R.path(['clients', socketId, 'sessionId'], db)

export const getSessionTopicFor = (db, socketId) =>
  `session/${getSessionIdFor(db, socketId)}`

export const updateSessionVar = R.curry((socketId, varName, value, db) =>
  R.assocPath(
    ['sessions', getSessionIdFor(db, socketId), 'selections', varName],
    value,
    db
  )
)
export const SESSION_VARS = 'sessionVars'
export const regSessionFeature = (
  { regEventFx, subscribeToState },
  { getRouteArgs, getSessionId, getScenarioMap = R.always({}) }
) => {
  if (!getRouteArgs && !getSessionId)
    throw new Error(
      'regSessionFeature either requires a `getSessionId` selector or can make one from `getRouteArgs`'
    )

  /* SELECTORS */
  const getSessionMap = R.prop('sessions')
  const getSessions = derive([getSessionMap], R.values)
  const getClients = R.pipe(
    R.prop('clients'),
    R.values
  )
  const getConnectionCounts = derive(
    [getClients],
    R.reduceBy(acc => acc + 1, 0, R.prop('sessionId'))
  )
  const getSessionIdFinal =
    getSessionId || derive(getRouteArgs, R.prop('sessionId'))

  const getDetailedSessions = derive(
    [getSessions, getConnectionCounts, getScenarioMap],
    (sessions, connectionCounts, scenarioMap) =>
      R.pipe(
        R.map(session =>
          R.pipe(
            R.assoc('connectionCount', connectionCounts[session.id]),
            R.assoc(
              'scenarioName',
              R.prop('name', scenarioMap[session.scenarioId])
            )
          )(session)
        ),
        R.sortBy(R.prop('scenarioName'))
      )(sessions)
  )

  /* EVENTS */
  /* get list of sessions on connect and the current session */
  regEventFx(dataEvent.SOCKET_CONNECTED, ({ db }) => ({
    emitN: [
      [sessionEvent.SUBSCRIBE_TO_LIST],
      [sessionEvent.SUBSCRIBE, getSessionIdFinal(db)]
    ]
  }))

  /* manage initial session vars */
  regEventFx(sessionEvent.INITIAL_VARS, (__, _, selections) => ({
    db: R.assoc(SESSION_VARS, selections)
  }))

  /* manage changes to session vars */
  regEventFx(sessionEvent.VAR_CHANGED, (__, _, { varName, value }) => ({
    db: R.assocPath([SESSION_VARS, varName], value)
  }))

  /* Handle explicit session create */
  regEventFx(sessionEvent.CREATE, (__, _, name) => ({
    db: R.assoc(['addingSession'], false),
    dispatch: [routeEvent.NAV_TO, ['map', { sessionId: name }]]
  }))

  /* Change a shared session var */
  regEventFx(
    sessionEvent.CHANGE_VAR,
    ({ db, socket }, _, { varName, value }) => ({
      db: updateSessionVar(socket.id, varName, value),
      rebroadcast: [
        getSessionTopicFor(db, socket.id),
        sessionEvent.CHANGE_VAR,
        {
          varName,
          value
        }
      ]
    })
  )

  /* When the URL route has changed for any reason, sync the session */
  regEventFx(routeEvent.CHANGED, ({ db }, _, { match }) => {
    const currentSessionId = R.prop('sessionId', db)
    const { sessionId } = match.params
    if (currentSessionId !== sessionId) {
      return {
        db: R.pipe(
          R.assoc('sessionId', sessionId),
          R.assocPath(['lastParamsForRoute', match.route.id], match.params)
        ),
        emitN: [[sessionEvent.SUBSCRIBE, sessionId]]
      }
    }
  })

  /* EXPORT */
  const { Sessions, AddSessionDialog } = createViews({
    getClients,
    getDetailedSessions,
    getIsAddingSession: R.prop('addingSession'),
    getSessionName: R.pathOr('', ['addingSessionForm', 'name'])
  })
  return {
    getClients,
    getSessionMap,
    getSessions,
    getConnectionCounts,
    getSessionId: getSessionIdFinal,
    getDetailedSessions,
    Sessions,
    AddSessionDialog
  }
}
