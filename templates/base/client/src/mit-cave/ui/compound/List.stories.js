import { storiesOf } from '@storybook/react'
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { compound } from '../storyConsts'
import { List, RadioListItem } from './List'
import { Pad } from './Pad'

storiesOf(compound('List'), module).add('radio list items', () => (
  <Pad>
    <List>
      <RadioListItem title="Option 1">Body goes here</RadioListItem>
      <RadioListItem title="Option 2" nav>
        Body goes here
      </RadioListItem>
      <RadioListItem title="Option 3" nav>
        Body goes here
      </RadioListItem>
      <RadioListItem title="Option 4" nav>
        Body goes here
      </RadioListItem>
    </List>
  </Pad>
))
