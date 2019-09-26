import { storiesOf } from '@storybook/react'
import React from 'react'
import { BigForm } from '../compound'
import { primitive } from '../storyConsts'

import { BigAttribute } from './BigAttribute'

storiesOf(primitive('BigAttribute'), module).add('Default', () => (
  <BigForm>
    <BigAttribute label="Some thing" value="ABC123" />
    <BigAttribute label="Some thing" value="ABC123-active" isActive />
  </BigForm>
))
