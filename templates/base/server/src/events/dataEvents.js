import { dataEvent, sessionEvent } from 'mit-cave'
import * as R from 'ramda'
import { regEventFx } from '../store'
import { getBackgroundData } from '../subs'

regEventFx(dataEvent.SOCKET_CONNECTED, ({ socket }) => ({
  subscribe: 'general',
  db: R.assocPath(['clients', socket.id], {
    id: socket.id,
    sessionId: 'default'
  }),
  /* Example of connection auto-subscribing */
  dispatch: [sessionEvent.SUBSCRIBE_TO_LIST]
}))

regEventFx(dataEvent.SOCKET_DISCONNECTED, ({ socket }) => ({
  db: R.dissocPath(['clients', socket.id]),
  broadcast: [
    'sessions',
    dataEvent.COLLECTION_ITEM_REMOVED,
    ['clients', socket.id]
  ]
}))

regEventFx(dataEvent.SUBSCRIBE_TO_BACKGROUND_DATA, ({ db }) => ({
  emit: [dataEvent.INITIAL_BACKGROUND_DATA, getBackgroundData(db)]
}))

/* This is an example of handling generic collections on per-row basis
 * without creating special events for each collection type
 * Note that this is for apps where role-based security is not a question (meaning most CAVE apps)
 * because this will let them query for anything within the server db atom
 * CURRENTLY NOT USED!
 */
regEventFx(
  dataEvent.SUBSCRIBE_TO_COLLECTION,
  async ({ db }, _, collectionPath) => ({
    subscribe: R.is(String, collectionPath)
      ? collectionPath
      : collectionPath.join('.'),
    emit: [
      dataEvent.INITIAL_COLLECTION,
      [
        collectionPath,
        R.is(String, collectionPath)
          ? R.prop(collectionPath, db)
          : R.path(collectionPath, db)
      ]
    ]
  })
)
