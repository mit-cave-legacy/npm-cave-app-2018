import {
  padEvent,
  modelEvent,
  ProgressBar,
  RunOutput
} from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { createSub, derive } from '../../common/reselect'
import {
  getCurrentScenario,
  getIsModelRunning,
  getLastRunSummary,
  getModelRunOutput,
  getModelRunProgress,
  getPad,
  withWiredPadProps
} from '../../features'

const PAD_ID = 'runOutput'

export const RunModelOutput = component(
  'RunModelOutput',
  createSub({
    getIsModelRunning,
    getCurrentScenarioName: derive([getCurrentScenario], R.prop('name')),
    getLastRunSummary,
    getModelRunOutput,
    getModelRunProgress,
    pad: getPad(PAD_ID)
  }),
  ({
    modelRunOutput,
    pad,
    isModelRunning,
    currentScenarioName,
    lastRunSummary,
    modelRunProgress,
    dispatch
  }) => (
    <RunOutput
      {...withWiredPadProps({ pad, padId: PAD_ID, defaultX: 100 })}
      title={
        isModelRunning ? (
          <ProgressBar percent={modelRunProgress} />
        ) : (
          `${currentScenarioName} ran ${lastRunSummary}`
        )
      }
      isRunning={isModelRunning}
      lines={modelRunOutput}
      onClose={() => dispatch(padEvent.HIDE, PAD_ID)}
      onRun={() => dispatch(modelEvent.RUN)}
      onCancel={() => dispatch(modelEvent.CANCEL)}
    />
  )
)
