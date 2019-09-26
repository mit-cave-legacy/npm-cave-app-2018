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
  }
}))

regEventFx('unhandled-async-error', (__, _, err) => {
  console.log('Unknown async error', err)
  process.exit(-1)
})
