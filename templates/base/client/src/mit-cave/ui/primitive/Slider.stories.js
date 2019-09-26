import { storiesOf } from '@storybook/react'
import React from 'react'
import { primitive } from '../storyConsts'
import { Slider } from './Slider'

storiesOf(primitive('Slider'), module).add('Default', () => (
  <Slider minProp={0} maxProp={100} />
))
