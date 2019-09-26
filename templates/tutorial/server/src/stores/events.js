import * as R from 'ramda'
import { regEventFx } from '../store'
import { storeEvent } from './eventTypes'


regEventFx(storeEvent.INITIAL_STORES_REQUEST, ({ db }) => {
  return {
    emit: [storeEvent.INITIAL_STORES, R.path(['data', 'stores'], db)]
  }
})
