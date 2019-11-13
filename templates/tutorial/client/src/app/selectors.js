import * as R from 'ramda'
import { derive } from 'framework-x'
import { getCurrentScenario, getCurrentScenarioId } from '../features'


export const isScenarioSelected = derive(getCurrentScenarioId, Boolean)

export const isDarkMode = derive(getCurrentScenario, R.pathOr(true, ['isDarkMode']))

export const getMapStyle = derive(isDarkMode, (dark) =>
  `mapbox://styles/mapbox/${dark ? 'dark' : 'light'}-v9`
)
