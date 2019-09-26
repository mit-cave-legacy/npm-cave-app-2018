import * as R from 'ramda'
import { regEventFx } from '../store'
import { storeEvent } from './eventTypes'
import { dataEvent } from 'mit-cave/data'


regEventFx(storeEvent.INITIAL_STORES, (_, __, stores) => {
  return {
    db: R.assocPath(['data', 'stores'], stores)
  }
})

regEventFx(dataEvent.SOCKET_CONNECTED, () => {
  return {
    emit: [storeEvent.INITIAL_STORES_REQUEST]
  }
})
