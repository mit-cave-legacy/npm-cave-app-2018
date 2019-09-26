import {
  IconCalculate,
  MenuBarButton,
  TickProgressBar, padEvent
} from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { createSub } from '../../common'
import {
  getCurrentScenarioId,
  getCurrentScenarioVersion,
  getHaveInputsChangedSinceLastRun,
  getIsModelRunning,
  getLastRunSummary,
  getModelRunOutput,
  getModelRunProgress
} from '../../features'

export const RunModelButton = component(
  'RunModel',
  createSub({
    getCurrentScenarioVersion,
    getIsModelRunning,
    getModelRunOutput,
    getCurrentScenarioId,
    getHaveInputsChangedSinceLastRun,
    getModelRunProgress,
    getLastRunSummary
  }),
  ({
    currentScenarioId,
    isModelRunning,
    haveInputsChangedSinceLastRun,
    modelRunProgress,
    dispatch
  }) => (
    <MenuBarButton
      icon={<IconCalculate />}
      title="Model"
      onClick={() => dispatch(padEvent.TOGGLE, 'runOutput')}
      disabled={currentScenarioId == null}
    >
      {currentScenarioId == null ? (
        '(pick scenario first)'
      ) : isModelRunning ? (
        <TickProgressBar percent={modelRunProgress} />
      ) : haveInputsChangedSinceLastRun ? (
        'Changes made'
      ) : (
            'No changes made'
          )}
    </MenuBarButton>
  )
)
