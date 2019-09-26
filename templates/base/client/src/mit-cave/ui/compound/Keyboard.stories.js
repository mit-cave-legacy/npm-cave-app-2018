import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'
import { px } from './../theme'
import {
  Keyboard,
  KEYBOARD_HEIGHT,
  KEYBOARD_WIDTH,
  StatefulKeyboard
} from './Keyboard'
import { Pad } from './Pad'

storiesOf(compound('Keyboard'), module).add('Default', () => (
  <div
    css={{
      margin: 10,
      padding: 20,
      border: 'solid 1px blue'
    }}
  >
    <StatefulKeyboard />
  </div>
))
