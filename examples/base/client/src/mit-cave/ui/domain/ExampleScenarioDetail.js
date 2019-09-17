import React from 'react'
import { css, cx } from 'react-emotion'
import { BigForm, ToggleButtons } from '../compound'
import { Button, BigAttribute } from '../primitive'
import { offWhite, radiantGraphite } from '../theme'

export const scenarioDetailClass = css({
  width: '100%',
  backgroundColor: radiantGraphite,
  color: offWhite
})

/**
 * Example scenario detail. Can replace with another one.
 * @param className
 * @param scenario: {id, name, description}
 * @returns {*}
 * @constructor
 */
export const ExampleScenarioDetail = ({
  className,
  scenario: { id, name, description } = {}
}) => (
  <BigForm className={cx(scenarioDetailClass, className)}>
    <BigAttribute label="Scenario Name" value={name} />
    <BigAttribute label="Description" value={description} />
    <ToggleButtons label="Optimization" value={'time'}>
      <Button value="time">Time</Button>
      <Button value="cost">Cost</Button>
    </ToggleButtons>
  </BigForm>
)
