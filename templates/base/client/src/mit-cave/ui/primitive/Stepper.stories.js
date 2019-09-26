import { storiesOf } from '@storybook/react'
import React from 'react'
import { primitive } from '../storyConsts'
import { Step, Stepper } from './Stepper'

const steps = [{}, {}, {}] // don't need any content for now

const stepsWithLabels = [
  { label: 'First Step' },
  { label: 'Second Step' },
  { label: 'Third Step' }
]

storiesOf(primitive('Stepper'), module)
  .add('Single step, inactive', () => <Step>1</Step>)
  .add('Single step, active', () => <Step active>2</Step>)
  .add('Single step, complete', () => <Step completed>2</Step>)
  .add('Stepper', () => <Stepper steps={steps} activeStep={2} />)
  .add('Stepper, with labels', () => (
    <Stepper steps={stepsWithLabels} activeStep={2} />
  ))
