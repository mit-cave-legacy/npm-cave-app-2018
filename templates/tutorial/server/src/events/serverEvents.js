import * as R from 'ramda'
import path from 'path'
import { readJson } from 'fs-extra'
import { regEventFx } from '../store'
import { sevt } from './../serverEventTypes'


regEventFx(sevt.INITIALIZE_DB, () => ({
  db: {
    clients: {},
    background: {},
    subscriptions: {},
    sessions: {
      default: {
        id: 'default'
      }
    }
  },
  dispatch: [sevt.LOAD_DATA]
}))

regEventFx(sevt.LOAD_DATA, async () => {
  const stores = await readJson(
    path.resolve(__dirname + './../data/walmart.json')
  )

  return {
    db: R.assocPath(['data', 'stores'], stores)
  }
})

regEventFx('unhandled-async-error', (__, _, err) => {
  console.log('Unknown async error', err)
  process.exit(-1)
})
