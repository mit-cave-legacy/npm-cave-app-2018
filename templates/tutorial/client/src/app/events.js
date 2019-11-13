import { scenarioEvent } from '../mit-cave/scenario'
import { regEventFx } from '../store'
import { appEvent } from './eventTypes'


regEventFx(appEvent.SET_DARK_MODE, (_, __, value) => ({
  dispatch: [scenarioEvent.CHANGE_CURRENT_VALUE, [['isDarkMode'], value]]
}))
