import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'

import { Options } from './Options'

const optionsList = ['supplier', 'hub', 'store']

storiesOf(compound('Options'), module).add('Default', () => (
  <Options options={optionsList} selectedOption={'supplier'} />
))
