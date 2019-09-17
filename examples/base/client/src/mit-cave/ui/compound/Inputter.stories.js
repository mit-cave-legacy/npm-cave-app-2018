import { storiesOf } from '@storybook/react'
import React from 'react'
import { Attribute, AttributeToggle } from '../primitive'
import { compound } from '../storyConsts'
import { AttributeForm } from './Form'
import { ConfirmInputter, WithInputter } from './Inputter'
import { Pad } from './Pad'

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
    enrolled: false,
    openAttribute: 'name'
  }

  render() {
    const { openAttribute, name, age, enrolled } = this.state
    const { x, y, isRevertable } = this.props
    const inputterProps = {
      ...schema[openAttribute],
      // isOpen: !!this.state[openAttribute],
      fieldName: openAttribute,
      initialValue: this.state[openAttribute],
      onConfirm: value => {
        console.log('confirm', value)
        this.setState({
          [openAttribute]: value,
          openAttribute: null
        })
      },
      onCancel: () => {
        console.log('cancel')
        this.setState({
          openAttribute: null
        })
      },
      isRevertable
    }

    return (
      <div>
        <Pad
          x={this.props.x}
          y={this.props.y}
          inputter={<ConfirmInputter {...inputterProps} />}
        >
          <AttributeForm
            activeAttribute={openAttribute}
            onOpenAttribute={attr => this.setState({ openAttribute: attr })}
          >
            <Attribute name="name" label="Name" value={name} />
            <Attribute name="age" label="Age" value={age} />
            <AttributeToggle
              name="enrolled"
              label="Enrolled"
              value={enrolled}
              onChange={val => {
                console.log('toggle!')
                this.setState({ enrolled: val })
              }}
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

storiesOf(compound('Inputter'), module)
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
  .add('with revert', () => (
    <div>
      <PropertiesPad x={980} y={400} isRevertable />
    </div>
  ))
