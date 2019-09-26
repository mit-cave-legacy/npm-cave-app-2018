import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'

import { DatePickerCAVE } from './DatePicker'

storiesOf(compound('DatePicker'), module)
  .add('Default', () => <DatePickerCAVE />)
  .add('Only Time', () => <DatePickerCAVE onlyTime />)
  .add('With Time', () => <DatePickerCAVE withTime />)
  .add('With Range', () => <DatePickerCAVE withRange />)
