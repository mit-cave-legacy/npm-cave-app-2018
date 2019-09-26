import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'
import { Numpad } from './Numpad'

storiesOf(compound('Numpad'), module).add('Default', () => (
  <div
    css={{
      margin: 10,
      padding: 20,
      border: 'solid 1px blue'
    }}
  >
    <Numpad />
  </div>
))
