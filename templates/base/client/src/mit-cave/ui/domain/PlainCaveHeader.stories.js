import { storiesOf } from '@storybook/react'
import React from 'react'
import { domain } from '../storyConsts'
import { FloatingPlainCaveHeader, PlainCaveHeader } from './PlainCaveHeader'

storiesOf(domain('PlainCaveHeader'), module)
  .add('Default', () => (
    <div
      style={{
        margin: 20
      }}
    >
      <PlainCaveHeader />
    </div>
  ))
  .add('Floating', () => (
    <div
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <FloatingPlainCaveHeader />
    </div>
  ))
