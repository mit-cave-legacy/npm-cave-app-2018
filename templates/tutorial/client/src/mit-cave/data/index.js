import * as R from 'ramda'
import createSocket from 'socket.io-client'
import { coreEvent } from 'mit-cave/core'
import { mergeOp } from 'mit-cave/util'
import { dataEvent } from './event'

export { dataEvent }

export const regDataFeature = (
  { dispatch, getState, regEventFx, regFx, subscribeToState },
  { socketUrl }
) => {
  /* SELECTORS */
  const getBackgroundData = R.prop('background')
  const getInitialDataReady = R.propOr(false, 'initialDataReceived')
  const getIsConnected = R.propOr(false, 'connected')

  /* SOCKET */
  const socket = createSocket(socketUrl, {
    // autoConnect: false,
    transports: ['websocket']
  })

  socket.on('connect', () => dispatch(dataEvent.SOCKET_CONNECTED))
  socket.on('disconnect', () => dispatch(dataEvent.SOCKET_DISCONNECTED))

  // server -> client
  socket.on('message', ({ type, payload }) => {
    // console.log('--->', { type, payload })
    dispatch(type, payload)
  })
  // client -> server
  const emit = ([type, payload]) => {
    // console.log('emitting', type, payload)
    // socket.io has a bit of a problem when serializing arrays at the root, so wrapping in object
    socket.emit('message', { type, payload })
  }

  regFx('emit', emit)

  regFx('emitN', messages => messages.forEach(emit))

  /* EVENTS */
  regEventFx(coreEvent.INITIALIZE_DB, _ => ({
    db: mergeOp({
      connected: false
    })
  }))

  regEventFx(dataEvent.SOCKET_CONNECTED, ({ db }) => ({
    db: R.assoc('connected', true),
    emitN: [[dataEvent.SUBSCRIBE_TO_BACKGROUND_DATA]]
  }))

  regEventFx(dataEvent.SOCKET_DISCONNECTED, ({ db }) => ({
    db: R.assoc('connected', false)
  }))

  regEventFx(dataEvent.INITIAL_BACKGROUND_DATA, (__, _, data) => ({
    db: R.assoc('background', data)
  }))

  /**
   * Collections are keyed maps maintained on the server
   * Just a convenience for managing "things that should sync" without creating
   * custom handlers
   */

  regEventFx(
    dataEvent.SUBSCRIBE_TO_COLLECTION,
    ({ db }, _, collectionPath) => ({
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
  regEventFx(dataEvent.INITIAL_COLLECTION, (__, _, [collection, items]) => ({
    db: R.assoc(collection, items)
  }))
  regEventFx(dataEvent.COLLECTION_ITEM_UPDATED, (__, _, [collection, item]) => {
    if (!item) {
      console.warn('collection item updated but payload was null')
      return
    }
    if (!item.id) {
      console.warn('collection items must have "id" property')
      return
    }
    return {
      db: R.assocPath([collection, item.id], item)
    }
  })
  regEventFx(dataEvent.COLLECTION_ITEM_REMOVED, (__, _, [collection, id]) => ({
    db: R.dissocPath([collection, id])
  }))

  // const startSocket = () => socket.connect()

  return {
    getInitialDataReady,
    getIsConnected,
    getBackgroundData
  }
}
