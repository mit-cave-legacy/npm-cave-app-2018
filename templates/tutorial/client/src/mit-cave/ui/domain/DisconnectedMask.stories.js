import { storiesOf } from '@storybook/react'
import React from 'react'
import { domain } from '../storyConsts'
import { DisconnectedMask } from './DisconnectedMask'

storiesOf(domain('DisconnectedMask'), module).add('Default', () => (
  <div
    style={{
      width: '100vw',
      height: '100vh'
    }}
  >
    <DisconnectedMask />
  </div>
))
