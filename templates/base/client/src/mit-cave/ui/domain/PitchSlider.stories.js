import { storiesOf } from '@storybook/react'
import React from 'react'
import { Pad } from '../compound'
import { domain } from '../storyConsts'
import { PitchSlider } from './PitchSlider'

class SliderTest extends React.Component {
  state = {
    value: 50
  }

  render() {
    return (
      <React.Fragment>
        <PitchSlider
          min={40}
          max={100}
          value={this.state.value}
          onChange={value => {
            this.setState({ value })
          }}
        />
        <div css={{ paddingLeft: 15 }}>{this.state.value}</div>
      </React.Fragment>
    )
  }
}

storiesOf(domain('PitchSlider'), module).add('Default', () => (
  <Pad x={20} y={20}>
    <div
      css={{
        padding: 40
      }}
    >
      <SliderTest />
    </div>
  </Pad>
))
