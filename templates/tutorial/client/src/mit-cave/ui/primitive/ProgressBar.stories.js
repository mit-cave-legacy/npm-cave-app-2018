import { storiesOf } from '@storybook/react'
import React from 'react'
import { px } from '../index'
import { primitive } from '../storyConsts'
import { radiantGraphite } from '../theme'
import { Button } from './Button'
import { ProgressBar, TickProgressBar } from './ProgressBar'

class AdvancingProgress extends React.Component {
  state = {
    percent: 0
  }

  render() {
    const { children } = this.props
    return (
      <div>
        {React.cloneElement(React.Children.only(children), {
          percent: this.state.percent
        })}
        <Button
          css={{ marginTop: px(40) }}
          onClick={() =>
            this.setState({
              percent: this.state.percent + 5
            })
          }
        >
          Advance
        </Button>
      </div>
    )
  }
}

storiesOf(primitive('Progress'), module)
  .add('Tick', () => (
    <div
      css={{
        padding: 20,
        backgroundColor: radiantGraphite
      }}
    >
      <AdvancingProgress>
        <TickProgressBar />
      </AdvancingProgress>
    </div>
  ))
  .add('Regular', () => (
    <div
      css={{
        padding: 20,
        backgroundColor: radiantGraphite
      }}
    >
      <AdvancingProgress>
        <ProgressBar />
      </AdvancingProgress>
    </div>
  ))
