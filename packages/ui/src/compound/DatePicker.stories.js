import { storiesOf } from '@storybook/react'
import React from 'react'
import { IconCancel } from '../icons'
import { compound } from '../storyConsts'

import { DatePickerCAVE } from './DatePicker'
import { Pad } from './Pad'

storiesOf(compound('DatePicker'), module)
  .add('Default', () => <DatePickerCAVE />)
  .add('Only Time', () => <DatePickerCAVE onlyTime />)
  .add('With Time', () => <DatePickerCAVE withTime />)
  .add('With Range', () => <DatePickerCAVE withRange />)
  .add('In Pad', () =>
    <Pad
      x={500}
      y={500}
      selfMove={false}
      onDragMove={() => {}}
      onDragEnd={() => {}}
      iconRight={<IconCancel />}
      title="Scenario Library">
      <DatePickerCAVE withRange />
    </Pad>)
