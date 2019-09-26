import { storiesOf } from '@storybook/react'
import React, { Component } from 'react'
import { primitive } from '../storyConsts'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

class RadioGroupStory extends Component {
  state = { value: null }
  handleCheck = value => {
    this.setState({ value })
  }

  render() {
    const { value } = this.state

    return (
      <div style={{ margin: 20 }}>
        <RadioGroup onSelect={this.handleCheck} value={value}>
          <Radio value="1" label="Check A" />
          <Radio value="2" label="Check B" />
          <Radio value="3" label="Check C" />
        </RadioGroup>
      </div>
    )
  }
}

storiesOf(primitive('Radio Group'), module).add('Default', () => (
  <RadioGroupStory />
))
