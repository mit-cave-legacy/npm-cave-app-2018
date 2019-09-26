import glam from 'glamorous'
import React, { Component } from 'react'
import { Button } from '../primitive/Button'

import { lightBlue, px, radiantGraphite } from '../theme'

const OptionsRoot = glam.div(
  'scrollable-options',
  { propsAreCssOverrides: true },
  {
    position: 'relative',
    fontSize: px(24),
    fontWeight: 100,
    width: px(240),
    height: px(300),
    display: 'flex',
    flexDirection: 'column',
    zIndex: 0,
    overflow: 'scroll' // TODO: make this better
  }
)

const customButtonStyle = {
  marginBottom: px(10),
  backgroundColor: radiantGraphite
}

const selectedButtonStyle = {
  color: lightBlue,
  border: `${px(2)} solid ${lightBlue}`,
  zIndex: 1
}

/**
 * Options
 */
export class Options extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedOptionName: this.props.selectedOption }
  }

  handleClick = e => {
    e.persist()
    this.setState(({ selectedOptionName }) => ({
      selectedOptionName: e.target.innerHTML
    }))
    this.props.handleOptionChange(e.target.innerHTML)
  }

  render = () => {
    return (
      <OptionsRoot>
        {this.props.options.map((option, idx) => {
          return (
            <Button
              key={idx}
              css={
                option === this.state.selectedOptionName
                  ? { ...selectedButtonStyle, ...customButtonStyle }
                  : customButtonStyle
              }
              id={
                option === this.state.selectedOptionName
                  ? 'selectedOption'
                  : 'unselectedOption'
              }
              onClick={this.handleClick}
            >
              {option}
            </Button>
          )
        })}
      </OptionsRoot>
    )
  }
}
