import { storiesOf } from '@storybook/react'
import React from 'react'
import { Button, TextField, Radio, RadioGroup, Toggle } from '../primitive'
import { compound } from '../storyConsts'
import { BigForm } from './Form'
import { Pad } from './Pad'
import { ToggleButtons } from './ToggleButtons'

storiesOf(compound('Form'), module).add('default', () => (
  <Pad x={30} y={30} title="Form">
    <BigForm>
      <TextField placeholder="Put something" label="What?" />
      <RadioGroup value="a" label="Pick one">
        <Radio value="a" label="Option A" />
        <Radio label="Option B" />
        <Radio label="Option C" />
      </RadioGroup>
      <ToggleButtons label="Good or bad?" value="good">
        <Button value="good">Good</Button>
        <Button value="bad">Bad</Button>
      </ToggleButtons>
      <Toggle label="Feature 1" />
      <Toggle label="Feature 2" />
      <Input label="Why?" />
    </BigForm>
  </Pad>
))
