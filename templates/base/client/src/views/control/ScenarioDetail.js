import { scenarioEvent, Form, TextField, theme, px, padSizes } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { css, cx } from 'react-emotion'
import { createSub } from '../../common'
import {
  getScenarioDetail,
  getScenarioToAdd
} from '../../features'

export const scenarioDetailClass = css({
  width: px(padSizes.standard.width),
  color: theme.offWhite
})
export const ScenarioDetailRaw = component(
  'ScenarioDetailRaw',
  ({
    dispatch,
    className,
    scenario: { id, name, description } = {}
  }) => (
    <Form className={cx(scenarioDetailClass, className)}>
      <TextField
        label="Scenario Name"
        value={name}
        onChange={value =>
          dispatch(scenarioEvent.CHANGE_VALUE_IN_SCENARIO_EDITOR, [id, 'name', value])
        }
      />
      <TextField
        label="Description"
        value={description}
        onChange={value =>
          dispatch(scenarioEvent.CHANGE_VALUE_IN_SCENARIO_EDITOR, [
            id,
            'description',
            value
          ])
        }
      />
    </Form>
  )
)

export const ScenarioDetail = component(
  'ScenarioDetail',
  createSub({
    adding: getScenarioToAdd,
    scenario: getScenarioDetail
  }),
  props => <ScenarioDetailRaw {...props} />
)
