import { storiesOf } from '@storybook/react'
import React from 'react'
import { primitive } from '../storyConsts'
import { ListItem } from './ListItem'

storiesOf(primitive('ListItem'), module)
  .add('Default', () => <ListItem itemName="">itemName</ListItem>)
  .add('Default, disabled', () => <ListItem disabled itemName="itemName" />)
  .add('With Navigation', () => (
    <ListItem onClick={() => {}} itemName="itemName" />
  ))
  .add('With Navigation, disabled', () => (
    <ListItem disabled onClick={() => {}} itemName="itemName" />
  ))
