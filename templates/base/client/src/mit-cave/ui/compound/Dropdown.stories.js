import { storiesOf } from '@storybook/react'
import React, { Component } from 'react'
import { RadioGroup } from '../primitive'
import { Radio } from '../primitive/Radio'
import { compound } from '../storyConsts'
import { standardBorder } from '../theme'
import { Dropdown } from './Dropdown'

class DropdownMenuStory extends Component {
  state = {
    value: null,
    isOpen: true
  }
  handleCheck = value => {
    this.setState({ value })
  }
  handleOpen = e => {
    this.setState({ isOpen: !this.state.isOpen })
  }
  handleClickaway = e => {
    if (e.target.closest('.special-trigger')) return
    this.setState({ isOpen: false })
  }

  render() {
    const { value, isOpen } = this.state

    return (
      <div style={{ margin: 80 }} className="special-trigger">
        <div
          css={{
            width: 400,
            height: 80,
            backgroundColor: 'blue',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
        >
          <div
            css={{
              position: 'relative',
              border: standardBorder,
              cursor: 'pointer'
            }}
          >
            <div
              onClick={this.handleOpen}
              css={{
                backgroundColor: 'orange',
                height: '100%'
              }}
            >
              Press me
            </div>
            <Dropdown onClickaway={this.handleClickaway} isOpen={isOpen}>
              <RadioGroup onSelect={this.handleCheck} value={value}>
                <Radio value="1" label="Check SA" />
                <Radio value="2" label="Check BB" />
                <Radio value="3" label="Check ZZD" />
              </RadioGroup>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}

storiesOf(compound('Dropdown'), module).add('Default', () => (
  <DropdownMenuStory />
))
