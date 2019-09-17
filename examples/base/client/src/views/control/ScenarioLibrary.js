import { padEvent, scenarioEvent, ScenarioManager } from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { createSub, derive } from '../../common/reselect'
import {
  getCurrentScenarioId,
  getPad,
  getScenarioSummaries,
  getScenarioToAdd,
  withWiredPadProps
} from '../../features'
import { ScenarioDetail } from './ScenarioDetail'

const PAD_ID = 'scenarios'

export const ScenarioLibrary = component(
  'ControlPanel',
  createSub({
    scenarios: derive(getScenarioSummaries, R.sortBy(R.prop('name'))),
    getCurrentScenarioId,
    getDetailId: R.prop('scenarioInDetail'),
    pad: getPad(PAD_ID),
    getScenarioToAdd,
    isNewScenarioInvalid: derive(getScenarioToAdd, R.complement(R.prop('name')))
  }),
  ({
    scenarios,
    css,
    currentScenarioId,
    pad,
    detailId,
    dispatch,
    scenarioToAdd,
    isNewScenarioInvalid
  }) => (
    <ScenarioManager
      {...R.omit(
        ['iconRight'],
        withWiredPadProps({ pad, padId: PAD_ID, defaultX: -200 })
      )}
      autoInput
      data={scenarios}
      value={currentScenarioId}
      detailId={detailId}
      adding={!!scenarioToAdd}
      onAdd={() => dispatch(scenarioEvent.BEGIN_ADD)}
      onOpenDetail={id => dispatch(scenarioEvent.OPEN_DETAIL, id)}
      onCloseDetail={id => dispatch(scenarioEvent.CLOSE_DETAIL, id)}
      onSelect={id => dispatch(scenarioEvent.SELECT, id)}
      onSave={newScenario => dispatch(scenarioEvent.ADD, newScenario)}
      onClose={() => dispatch(padEvent.HIDE, PAD_ID)}
      onDelete={id => dispatch(scenarioEvent.DELETE, id)}
      isNewScenarioInvalid={isNewScenarioInvalid}
    >
      <ScenarioDetail />
    </ScenarioManager>
  )
)
