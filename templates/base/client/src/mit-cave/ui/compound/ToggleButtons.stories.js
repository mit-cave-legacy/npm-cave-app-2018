import { storiesOf } from '@storybook/react'
import React from 'react'

import { Button } from '../primitive/Button'
import { compound } from '../storyConsts'
import { BigForm } from './Form'
import { Pad } from './Pad'
import { ToggleButtons } from './ToggleButtons'

storiesOf(compound('ToggleButtons'), module).add('Button group', () => (
  <Pad x={20} y={20}>
    <BigForm>
      <ToggleButtons>
        <Button alt>Left</Button>
        <Button alt>Middle</Button>
        <Button alt>Right</Button>
      </ToggleButtons>
    </BigForm>
  </Pad>
))
