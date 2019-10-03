import { distanceInWordsToNow } from 'date-fns'
import * as R from 'ramda'
import { prop } from 'ramda'
import { derive } from 'mit-cave/util'
import { modelEvent } from './event'

export { modelEvent }

export const regModelFeature = ({ regEventFx }, {
  getCurrentScenario,
  showPad,
  calcModelInputHash
} = {}) => {
  if (!getCurrentScenario) throw new Error('regModelFeature must provide `getCurrentScenario` (from scenarios)')
  if (!showPad) throw new Error('regModelFeature must provide `showPad` (from pads)')
  if (!calcModelInputHash) throw new Error('regModelFeature requires `calcModelInputHash` function')

  /* SELECTORS */
  const getCurrentScenarioId = derive(getCurrentScenario, R.prop('id'))
  const getLastRun = derive(getCurrentScenario, prop('lastRun'))
  const getModelRunRaw = prop('modelRun')
  const getModelRun = derive(
    [getCurrentScenarioId, getModelRunRaw],
    (scenarioId, modelRun = {}) =>
      modelRun.scenarioId === scenarioId ? modelRun : null
  )

  const getIsModelRunning = derive(getModelRun, run => run && !run.done)
  const getModelRunProgress = derive(
    getModelRun,
    R.propOr(0, 'percentProgress')
  )
  const getModelRunOutput = derive(getModelRun, R.propOr([], 'output'))
  const getLastRunSummary = derive(getLastRun, lastRun => {
    if (!lastRun) return 'never'
    if (lastRun.error) return 'error on last run'
    return `${distanceInWordsToNow(lastRun.timestamp)} ago`
  })

  const getInputHash = derive(getCurrentScenario, calcModelInputHash)

  const getLastRunInputHash = derive(getLastRun, prop('inputHash'))
  const getHaveInputsChangedSinceLastRun = derive(
    [getLastRunInputHash, getInputHash],
    (last, current) => {
      return last !== current
    }
  )

  /* EVENTS */
  regEventFx(modelEvent.RUN, ({ db }) => ({
    emit: [modelEvent.RUN, getCurrentScenarioId(db)],
    db: showPad('runOutput')
  }))
  regEventFx(modelEvent.CANCEL, ({ db }) => ({
    emit: [modelEvent.CANCEL, getCurrentScenarioId(db)]
  }))
  regEventFx(modelEvent.RUN_STARTED, (__, _, modelRun) => ({
    db: R.pipe(
      R.assoc('modelRun', modelRun),
      showPad('runOutput')
    )
  }))
  regEventFx(modelEvent.RUN_PROGRESS, (__, _, modelRun) => ({
    db: R.assoc('modelRun', modelRun)
  }))
  regEventFx(modelEvent.RUN_FINISHED, (__, _, modelRun) => ({
    db: R.assoc('modelRun', modelRun)
  }))
  regEventFx(modelEvent.RUN_FAILURE, err => ({
    db: R.mergeDeepLeft({
      modelRun: {
        done: true,
        error: err
      }
    })
  }))
  regEventFx(modelEvent.RUN_CANCELLED, (__, _, modelRun) => ({
    db: R.assoc('modelRun', modelRun)
  }))

  /* OUTPUT from scenario */
  regEventFx(modelEvent.RUN_OUTPUT, (__, _, output) => ({
    db: R.assocPath(['modelOutputs', output.id], output)
  }))


  return {
    getLastRun,
    getModelRunRaw,
    getModelRunOutput,
    getModelRun,
    getIsModelRunning,
    getModelRunProgress,
    getLastRunSummary,
    getInputHash,
    getLastRunInputHash,
    getHaveInputsChangedSinceLastRun
  }

}
