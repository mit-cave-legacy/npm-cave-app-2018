import { storiesOf } from '@storybook/react'
import React from 'react'
import { Attribute, BigAttribute } from '../primitive'
import { compound } from '../storyConsts'
import { AttributeForm, Form } from './Form'
import { WithInputter } from './Inputter'
import { Modal } from './Modal'
import { Pad } from './Pad'
import { CenteredInPage } from './ControlLayout'

const schema = {
  name: {
    type: 'keyboard'
  },
  age: {
    type: 'numpad'
  }
}

class PropertiesPad extends React.Component {
  state = {
    name: 'Nobody',
    age: 20,
    enrolled: false
  }

  render() {
    const { name, age, enrolled } = this.state
    const { x, y } = this.props
    return (
      <div>
        <Pad x={this.props.x} y={this.props.y} autoInput>
          <AttributeForm>
            <Attribute
              label="Name"
              value={name}
              type="keyboard"
              onChange={name => this.setState({ name })}
            />
            <Attribute
              label="Age"
              value={age}
              type="numpad"
              onChange={age => this.setState({ age })}
            />
          </AttributeForm>
        </Pad>
        <svg
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <g transform={`translate(${x}, ${y})`}>
            <line y2={200} stroke="red" strokeWidth={2} />
          </g>
        </svg>
      </div>
    )
  }
}

class BigPropertiesPad extends React.Component {
  state = {
    name: 'Nobody',
    age: 20,
    enrolled: false
  }

  render() {
    const { name, age } = this.state
    const { x, y, liveInput } = this.props
    return (
      <div>
        <Pad x={this.props.x} y={this.props.y} autoInput liveInput={liveInput}>
          <Form>
            <BigAttribute
              label="Name"
              value={name}
              type="keyboard"
              onChange={name => this.setState({ name })}
            />
            <BigAttribute
              label="Age"
              value={age}
              type="numpad"
              onChange={age => this.setState({ age })}
            />
          </Form>
        </Pad>
        <svg
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <g transform={`translate(${x}, ${y})`}>
            <line y2={200} stroke="red" strokeWidth={2} />
          </g>
        </svg>
      </div>
    )
  }
}
class CoolModal extends React.Component {
  state = {
    name: 'Nobody',
    age: 20,
    enrolled: false
  }

  render() {
    const { name, age, enrolled } = this.state
    const { liveInput } = this.props
    return (
      <Modal title="Cool Modal" autoInput>
        <Form>
          <BigAttribute
            label="Name"
            value={name}
            type="keyboard"
            onChange={name => this.setState({ name })}
          />
          <BigAttribute
            label="Age"
            value={age}
            type="numpad"
            onChange={age => this.setState({ age })}
          />
        </Form>
      </Modal>
    )
  }
}

storiesOf(compound('AutoInputter'), module)
  .add('input on right', () => (
    <div>
      <PropertiesPad x={200} y={400} />
    </div>
  ))
  .add('input on left', () => (
    <div>
      <PropertiesPad x={980} y={400} />
    </div>
  ))
  .add('big inputs', () => (
    <div>
      <BigPropertiesPad x={980} y={400} />
    </div>
  ))
  .add('modal', () => (
    <CenteredInPage>
      <CoolModal />
    </CenteredInPage>
  ))
  .add('live input', () => (
    <div>
      <BigPropertiesPad x={980} y={400} liveInput />
    </div>
  ))
