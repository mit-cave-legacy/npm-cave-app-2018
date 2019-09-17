import { storiesOf } from '@storybook/react'
import React from 'react'
import { Button } from '../primitive/Button'
import { Stepper } from '../primitive/Stepper'
import { compound } from '../storyConsts'
import { px } from '../theme'
import { Modal } from './Modal'

const inputsWithLabels = [
  { label: 'First' },
  { label: 'Second' },
  { label: 'Third' }
]

const stepsWithLabels = [
  { label: 'First Step' },
  { label: 'Second Step' },
  { label: 'Third Step' }
]

storiesOf(compound('Modal'), module)
  .add('With inputs and one button', () => (
    <Modal
      title="Modal name"
      button1={<Button css={{ width: '100% !important' }}>Got it!</Button>}
    >
      {/*<InputGroup inputs={inputsWithLabels} />*/}
    </Modal>
  ))
  .add('Extra wide', () => (
    <Modal
      css={{
        width: px(900)
      }}
      title="Modal name"
      button1={<Button>Got it!</Button>}
    >
      {/*<InputGroup inputs={inputsWithLabels} />*/}
    </Modal>
  ))
  .add('With stepper and two button', () => (
    <Modal
      title="Modal name"
      stepper={<Stepper steps={stepsWithLabels} activeStep={2} />}
      button1={<Button>Cancel</Button>}
      button2={<Button>Next</Button>}
    />
  ))
  .add('With form, stepper and two button', () => (
    <Modal
      title="Modal name"
      stepper={<Stepper steps={stepsWithLabels} activeStep={2} />}
      button1={<Button>Cancel</Button>}
      button2={<Button>Next</Button>}
    >
      {/*<InputGroup inputs={inputsWithLabels} />*/}
    </Modal>
  ))
