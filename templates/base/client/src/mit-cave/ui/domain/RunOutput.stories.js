import { storiesOf } from '@storybook/react'
import Chance from 'chance'
import * as R from 'ramda'
import React from 'react'
import { Button } from '../primitive'
import { domain } from '../storyConsts'
import { px } from '../theme'
import { RunOutput } from './RunOutput'

const chance = new Chance()

class FakeRunner extends React.Component {
  state = {
    lines: R.range(0, 5).map(() => chance.sentence())
  }
  handleAddLine = () => {
    this.setState({
      lines: R.append(chance.sentence(), this.state.lines)
    })
  }

  render() {
    return (
      <React.Fragment>
        <RunOutput
          x={20}
          y={400}
          isModelRunning={true}
          lines={this.state.lines}
        />
        <div
          css={{
            position: 'absolute',
            top: px(440),
            left: px(20)
          }}
        >
          <Button onClick={this.handleAddLine}>Add line</Button>
        </div>
      </React.Fragment>
    )
  }
}

storiesOf(domain('RunOutput'), module)
  .add('Default', () => (
    <RunOutput
      x={20}
      y={400}
      isModelRunning={true}
      lines={R.range(0, chance.d12()).map(() => chance.sentence())}
    />
  ))
  .add('Runnable', () => <FakeRunner />)
