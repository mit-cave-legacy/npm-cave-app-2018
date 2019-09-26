import { storiesOf } from '@storybook/react'
import React, { Component } from 'react'
import { BigForm, Pad } from '../compound'
import { primitive } from '../storyConsts'

import { CheckBox } from './CheckBox'
import { CheckBoxGroup } from './CheckBoxGroup'

class CheckBoxStory extends Component {
  state = { checked: false }

  handleCheck = e => {
    console.log(e.target)
    this.setState({ checked: !this.state.checked })
  }

  render() {
    const { checked } = this.state
    return (
      <CheckBox
        id="default"
        onClick={this.handleCheck}
        label="check box"
        isChecked={checked}
        {...this.props}
      >
        A most peculiar checkbox
      </CheckBox>
    )
  }
}

class CheckBoxGroupStory extends Component {
  state = {}

  render() {
    return (
      <CheckBoxGroup label="I am a group of things">
        <CheckBoxStory id="1">Something A</CheckBoxStory>
        <CheckBoxStory id="2">Something B</CheckBoxStory>
        <CheckBoxStory id="3">Something C</CheckBoxStory>
        <CheckBoxStory id="4">Something D</CheckBoxStory>
      </CheckBoxGroup>
    )
  }
}

storiesOf(primitive('CheckBox'), module)
  .add('Default', () => <CheckBoxStory />)
  .add('Disabled', () => <CheckBoxStory disabled />)

storiesOf(primitive('CheckBox Group'), module).add('Default', () => (
  <Pad>
    <BigForm>
      <CheckBoxGroupStory />
    </BigForm>
  </Pad>
))
