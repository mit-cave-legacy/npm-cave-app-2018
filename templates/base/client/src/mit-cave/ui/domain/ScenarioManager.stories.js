import { storiesOf } from '@storybook/react'
import * as R from 'ramda'
import React from 'react'
import { domain } from '../storyConsts'
import { ExampleScenarioDetail } from './ExampleScenarioDetail'
import { ScenarioManager } from './ScenarioManager'
import { ScenarioManagerWithTrivialState } from './ScenarioManagerWithTrivialState'

let maxId = 5
const scenarios = [
  {
    id: 1,
    name: 'Scenario 1',
    description: 'asdfasdf asdfasd asdfasdf'
  },
  {
    id: 2,
    name: 'Scenario 2',
    description: 'qwerqwer  qwerqwer qwerqwer'
  },
  {
    id: 3,
    name: 'Scenario 3',
    description: 'zxcvzxcvzx zxcvzx zxcvzxv'
  },
  {
    id: 4,
    name: 'Scenario 4',
    description: 'ghkjfgjhfghjfghjgh fghjfgh fghj '
  },
  {
    id: 5,
    name: 'Fresno 4',
    description: 'yutuytu tyu tutu tttuewegfsdgsd sdgsdsdf s g'
  }
]

class ScenarioHolder extends React.Component {
  state = {
    selectedId: null,
    scenarios: R.indexBy(R.prop('id'), scenarios),
    hide: false
  }
  onSelect = id => {
    this.setState({
      selectedId: id
    })
  }
  onSave = ({ name }) => {
    const { scenarios } = this.state
    const id = maxId++
    const data = { id, name }
    this.setState({ scenarios: R.assoc(id, data, scenarios) })
  }
  onClose = () => {
    this.setState({
      hide: true
    })
  }
  onDelete = id => {
    // console.log('deleting', id)
    this.setState({ scenarios: R.dissoc(id, this.state.scenarios) })
  }
  render() {
    const { hide, scenarios, selectedId } = this.state
    return (
      <ScenarioManagerWithTrivialState
        x={400}
        y={500}
        hide={hide}
        data={R.values(scenarios)}
        value={selectedId}
        onSelect={this.onSelect}
        onSave={this.onSave}
        onClose={this.onClose}
        onDelete={this.onDelete}
      >
        <ExampleScenarioDetail />
      </ScenarioManagerWithTrivialState>
    )
  }
}

storiesOf(domain('ScenarioManager'), module)
  .add('Collapsed', () => (
    <ScenarioManager
      selfMove={true}
      x={400}
      y={500}
      data={scenarios}
      value={2}
    />
  ))
  .add('Expanded', () => (
    <ScenarioManager x={400} y={500} detailId={1} value={1} data={scenarios} />
  ))
  .add('live', () => <ScenarioHolder />)
