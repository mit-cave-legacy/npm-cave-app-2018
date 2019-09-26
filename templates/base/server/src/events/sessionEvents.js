import { dataEvent, sessionEvent } from 'mit-cave'
import * as R from 'ramda'
import { regEventFx } from '../store'
import { getSelectionsFor, getSessionMetadata } from '../subs'

regEventFx(sessionEvent.SUBSCRIBE, ({ db, socket }, _, sessionId) => {
  if (!sessionId) {
    console.warn('Client attempted to subscribe to null session')
    return
  }
  const data = getSelectionsFor(db, sessionId)
  /* update client with what session it is in, and create a session if not there */
  const mutate = R.pipe(
    R.assocPath(['clients', socket.id, 'sessionId'], sessionId),
    R.assocPath(
      ['sessions', sessionId],
      R.pathOr({ id: sessionId }, ['sessions', sessionId], db)
    )
  )
  const nextDb = mutate(db)

  return [
    ['unsubscribe', `session/*`],
    ['subscribe', `session/${sessionId}`],
    ['db', nextDb],
    ['emit', [sessionEvent.INITIAL_VARS, data]],
    /* update the list of connected clients */
    [
      'broadcast',
      [
        'sessions',
        dataEvent.COLLECTION_ITEM_UPDATED,
        [
          'clients',
          {
            id: socket.id,
            sessionId
          }
        ]
      ]
    ],
    /* update the session info in case a new one was created */
    [
      'broadcast',
      [
        'sessions',
        dataEvent.COLLECTION_ITEM_UPDATED,
        ['sessions', getSessionMetadata(nextDb)[sessionId]]
      ]
    ],
    /* make sure it "takes" on originator */
    [
      'emit',
      [
        dataEvent.COLLECTION_ITEM_UPDATED,
        ['sessions', getSessionMetadata(nextDb)[sessionId]]
      ]
    ]
  ]
})

/* Here we are splitting the difference -- session meta data subscription is its own event,
 * but updates to the client are handled generically
 */
regEventFx(sessionEvent.SUBSCRIBE_TO_LIST, async ({ db }) => ({
  subscribe: 'sessions',
  emitN: [
    [dataEvent.INITIAL_COLLECTION, ['clients', R.prop('clients', db)]],
    [dataEvent.INITIAL_COLLECTION, ['sessions', getSessionMetadata(db)]]
  ]
}))

const getSessionIdFor = (db, socketId) =>
  R.path(['clients', socketId, 'sessionId'], db)
export const getSessionTopicFor = (db, socketId) =>
  `session/${getSessionIdFor(db, socketId)}`

const updateSessionVar = R.curry((socketId, varName, value, db) =>
  R.assocPath(
    ['sessions', getSessionIdFor(db, socketId), 'selections', varName],
    value,
    db
  )
)

/* An example of a client sending up a more generic "update this variable" request
 * useful when there's lots of them, and there isn't any specific server behavior attached
 * Here we're just rebroadcasting whatever the client sends.
 */
regEventFx(
  sessionEvent.CHANGE_VAR,
  ({ db, socket }, _, { varName, value }) => ({
    db: updateSessionVar(socket.id, varName, value),
    rebroadcast: [
      getSessionTopicFor(db, socket.id),
      sessionEvent.VAR_CHANGED,
      {
        varName,
        value
      }
    ]
  })
)
