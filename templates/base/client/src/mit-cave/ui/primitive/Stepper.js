import React from 'react'
import glam, { Div } from 'glamorous'
import {
  radiantGraphite,
  confirm,
  lightGrey,
  darkGrey,
  mediumGrey,
  offWhite,
  lightBlue,
  px
} from '../theme'

const StepperWrapper = glam.div({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

export const Step = glam.div(
  // one single step
  'step',
  {
    fontSize: px(15),
    fontWeight: '100',
    borderRadius: '50%',
    height: px(28),
    width: px(28),
    display: 'flex',
    alignItems: 'center', // numbers in the circle center
    justifyContent: 'space-around',
    color: offWhite,
    backgroundColor: radiantGraphite,
    border: `${px(1)} solid ${lightGrey}`
  },
  ({ active }) =>
    active
      ? {
          backgroundColor: darkGrey,
          border: `${px(1)} solid ${lightBlue}`,
          boxShadow: `${px(0)} ${px(0)} ${px(28)} ${px(
            3
          )} rgba(16, 94, 231, 0.4)`
        }
      : {},
  ({ completed }) =>
    completed
      ? {
          // @todo: need icon for this
          border: `${px(1)} solid ${confirm}`
        }
      : {}
)

const StepperLabel = glam.div({
  color: mediumGrey,
  fontSize: px(13),
  position: 'absolute',
  top: px(40),
  display: 'flex',
  whiteSpace: 'nowrap'
})

const StepperRoot = glam.div({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  maxWidth: px(700), // TODO: probably should remove
  marginBottom: px(60),
  zIndex: 0
})

/**
 * Stepper
 * @param steps
 * @param activeStep
 * @param props
 * @returns {*}
 * @constructor
 */
export const Stepper = ({ steps, activeStep, ...props }) => (
  <StepperRoot {...props}>
    <Div
      css={{
        position: 'absolute',
        left: 0,
        top: '50%',
        backgroundColor: lightGrey,
        width: '100%',
        height: px(2),
        display: 'block',
        zIndex: -1
      }}
    />
    {steps.map(({ label }, index) => {
      const stepNum = index + 1
      const active = stepNum === activeStep
      const completed = stepNum < activeStep
      return (
        <StepperWrapper>
          <Step active={active} completed={completed} label={label}>
            {stepNum}
          </Step>
          {label && <StepperLabel>{label}</StepperLabel>}
        </StepperWrapper>
      )
    })}
  </StepperRoot>
)
