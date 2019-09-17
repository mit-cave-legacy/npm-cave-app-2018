import { storiesOf } from '@storybook/react'
import React from 'react'
import { AttributeForm, FormPad } from '../compound'
import { primitive } from '../storyConsts'
import { px, radiantGraphite } from '../theme'
import { AttributeToggle, Toggle, Toggler } from './Toggle'

class ToggleHolder extends React.Component {
  state = {
    on: false
  }
  handleToggle = () => {
    console.log('toggle!')
    this.setState({ on: !this.state.on })
  }

  render() {
    const { children } = this.props
    const { on } = this.state
    return (
      <div
        css={{
          margin: 10,
          backgroundColor: radiantGraphite,
          width: px(220),
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            onToggle: this.handleToggle, // for raw...should probably fix
            onChange: this.handleToggle, // for attribute toggle
            value: on
          })
        )}
      </div>
    )
  }
}

storiesOf(primitive('Toggle'), module)
.add('Regular form mode', () => (
  <ToggleHolder>
    <Toggle label="Delivery" />
  </ToggleHolder>
))
.add('AttributeToggle', () => (
  <ToggleHolder>
    <AttributeToggle label="Delivery" />
  </ToggleHolder>
))
.add('Just toggler', () => (
  <ToggleHolder>
    <Toggler />
  </ToggleHolder>
))

storiesOf(primitive('Attribute'), module)
.add('AttributeToggle', () => (
  <AttributeForm>
    <ToggleHolder>
      <AttributeToggle
        label="Delivery"
      />
    </ToggleHolder>
  </AttributeForm>
))
