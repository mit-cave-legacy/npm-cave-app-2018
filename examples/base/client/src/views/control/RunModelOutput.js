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

/**
 * RunModelOutput
 *
 * For apps with machine learning model integration through the `@mit-cave/model` package
 *
 * Shows progress and other messages from the server for a model run.
 * An example model is provided in `server/run-model`.
 * Sample code for running it and receiving output is in `server/events/modelEvents.js`.
 *
 * Clients that invoke `regModelFeature` in `client/features/index` update their state
 * in response to `@mit-cave/model` events received from the server.
 *
 * Model-specific props for this component are subscribed to with functions
 * returned by `regModelFeature`.
 *
 */
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
