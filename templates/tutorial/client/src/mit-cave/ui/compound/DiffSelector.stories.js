import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'

storiesOf(compound('DiffSelector'), module)
  .add('Default', () => <DiffSelector />)
  .add('Only Time', () => <DiffSelector />)
  .add('With Time', () => <DiffSelector />)
  .add('With Range', () => <DiffSelector />)
