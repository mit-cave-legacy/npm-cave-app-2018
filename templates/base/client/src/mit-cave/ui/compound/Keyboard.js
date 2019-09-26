import * as R from 'ramda'
import { addIndex, map, toLower, toUpper } from 'ramda'
import React, { Component } from 'react'
import styled, { css, cx } from 'react-emotion'
import { Button } from '../primitive/Button'
import { Input } from '../primitive/Input'

import { darkGrey, greyBlue, lightBlue, px, radiantGraphite } from '../theme'

export const KEYBOARD_WIDTH = 702
export const KEYBOARD_HEIGHT = 366
const mapArrayIndexed = addIndex(map)

const KeyboardRoot = styled('div')({
  label: 'keyboard',
  fontSize: px(16),
  fontWeight: 100,
  width: `${px(KEYBOARD_WIDTH)} !important`,
  height: px(KEYBOARD_HEIGHT),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: `${radiantGraphite} !important`,
  justifyContent: 'center'
})

const customInputStyle = {
  fontSize: px(20),
  fontWeight: 100,
  height: px(40),
  border: `${px(1)} solid ${greyBlue}`,
  marginBottom: px(12),
  textAlign: 'center',
  ':hover': {
    backgroundColor: 'none'
  },
  ':active': {
    backgroundColor: darkGrey,
    border: `${px(1)} solid ${lightBlue}`
  },
  ':focus': {
    backgroundColor: darkGrey,
    border: `${px(1)} solid ${lightBlue}`
  }
}

const iconEraseStyle = {
  position: 'absolute',
  left: px(176),
  top: px(30)
}

const buttonRowStyle = {
  display: 'inline-flex',
  justifyContent: 'space-between',
  paddingTop: px(12)
}

const customButtonStyle = {
  fontSize: px(15),
  fontWeight: 100,
  padding: px(5),
  width: px(36),
  height: px(36),
  border: `${px(1)} solid ${greyBlue}`,
  borderRadius: px(8)
}

const actionButtonStyle = {
  display: 'block'
}

const delButtonStyle = {
  // ...actionButtonStyle, //how to inherit from other const css
  textTransform: 'lowercase',
  width: px(66),
  textAlign: 'right',
  paddingRight: px(12)
}

const tabButtonStyle = {
  textTransform: 'lowercase',
  minWidth: px(66),
  textAlign: 'left',
  paddingLeft: px(12)
}

const capsButtonStyle = {
  width: px(74),
  textAlign: 'left',
  paddingLeft: px(12)
}

const enterButtonStyle = {
  textTransform: 'lowercase',
  width: px(74),
  textAlign: 'right',
  paddingRight: px(12)
}

const shiftLeftButtonStyle = {
  textTransform: 'lowercase',
  width: px(96),
  textAlign: 'left',
  paddingLeft: px(12)
}

const shiftRightButtonStyle = {
  textTransform: 'lowercase',
  width: px(96),
  textAlign: 'right',
  paddingRight: px(12)
}

const spaceButtonStyle = {
  fontSize: px(20),
  fontWeight: 100,
  padding: px(5),
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '60%',
  height: px(36),
  border: `${px(1)} solid ${greyBlue}`,
  borderRadius: px(8),
  position: 'relative'
}

const spaceButtonRowStyle = {
  display: 'inline-flex',
  justifyContent: 'center',
  paddingTop: px(12)
}

const buttonStyles = {
  del: [actionButtonStyle, delButtonStyle],
  tab: [actionButtonStyle, tabButtonStyle],
  caps: [actionButtonStyle, capsButtonStyle],
  enter: [actionButtonStyle, enterButtonStyle],
  leftShift: [actionButtonStyle, shiftLeftButtonStyle],
  rightShift: [actionButtonStyle, shiftRightButtonStyle]
}

const row1 = [
  {
    label: '`'
  },
  {
    label: '1'
  },
  {
    label: '2'
  },
  {
    label: '3'
  },
  {
    label: '4'
  },
  {
    label: '5'
  },
  {
    label: '6'
  },
  {
    label: '7'
  },
  {
    label: '8'
  },
  {
    label: '9'
  },
  {
    label: '0'
  },
  {
    label: '-'
  },
  {
    label: '='
  },
  {
    label: 'del',
    value: 'del'
  }
]

const row2 = [
  {
    value: 'tab',
    label: ''
  },
  {
    label: 'q'
  },
  {
    label: 'w'
  },
  {
    label: 'e'
  },
  {
    label: 'r'
  },
  {
    label: 't'
  },
  {
    label: 'y'
  },
  {
    label: 'u'
  },
  {
    label: 'i'
  },
  {
    label: 'o'
  },
  {
    label: 'p'
  },
  {
    label: '['
  },
  {
    label: ']'
  },
  {
    label: '\\'
  }
]

const row3 = [
  {
    label: 'caps'
  },
  {
    label: 'a'
  },
  {
    label: 's'
  },
  {
    label: 'd'
  },
  {
    label: 'f'
  },
  {
    label: 'g'
  },
  {
    label: 'h'
  },
  {
    label: 'j'
  },
  {
    label: 'k'
  },
  {
    label: 'l'
  },
  {
    label: ';'
  },
  {
    label: "'"
  },
  {
    label: 'enter'
  }
]
const row4 = [
  {
    value: 'leftShift',
    label: 'shift'
  },
  {
    label: 'z'
  },
  {
    label: 'x'
  },
  {
    label: 'c'
  },
  {
    label: 'v'
  },
  {
    label: 'b'
  },
  {
    label: 'n'
  },
  {
    label: 'm'
  },
  {
    label: ','
  },
  {
    label: '.'
  },
  {
    label: '/'
  },
  {
    value: 'rightShift',
    label: 'shift'
  }
]

const row5 = [
  {
    label: ' '
  }
]

const rows = [row1, row2, row3, row4]

const makeCase = isCaps => (isCaps ? toUpper : toLower)

export class AbstractKeyboard extends Component {
  state = {
    isCaps: false,
    isShift: false
  }

  static defaultProps = {
    value: '',
    onChange: () => {}
  }

  componentDidMount() {
    this.handleCursorChange()
    this.inputEl.focus()
    // this.inputEl.addEventListener('blur', e => {
    //   console.log('input lost focus')
    // })
  }

  handleButtonClick = val => {
    if (val == null) return

    if (val === 'enter') {
      if (this.props.onClickEnter) this.props.onClickEnter()
      return
    }

    this.inputEl.focus()

    const { isCaps, isShift } = this.state
    if (val === 'caps') {
      this.setState({ isCaps: !isCaps })
      return
    }

    if (val === 'shift' || val === 'leftShift' || val === 'rightShift') {
      this.setState({ isShift: !isShift })
      return
    }
    const { selectionStart, selectionEnd } = this.state
    const { value, onChange } = this.props

    if (val === 'del') {
      const backDelete = selectionStart === selectionEnd
      const start = backDelete ? selectionStart - 1 : selectionStart
      const end = backDelete ? selectionStart : selectionEnd - selectionStart
      this.cursorPositionShouldBe = Math.max(0, start)
      onChange(R.join('', R.remove(start, end, value)))
      return
    }

    const cappedKey = isCaps || isShift ? R.toUpper(val) : R.toLower(val)

    const newValue = R.pipe(
      R.remove(selectionStart, selectionEnd - selectionStart),
      R.insert(selectionStart, cappedKey),
      R.join('')
    )(value)
    this.cursorPositionShouldBe = selectionStart + cappedKey.length
    onChange(newValue)
    if (isShift) this.setState({ isShift: false })
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.value !== this.props.value) {
      const { cursorPositionShouldBe } = this
      if (
        cursorPositionShouldBe != null &&
        this.inputEl.selectionStart !== this.cursorPositionShouldBe
      ) {
        this.inputEl.selectionStart = cursorPositionShouldBe
        this.inputEl.selectionEnd = cursorPositionShouldBe
      }
      this.handleCursorChange()
    }
  }

  handleCursorChange = () => {
    delete this.cursorPositionShouldBe
    const { selectionStart, selectionEnd } = this.inputEl
    this.setState({
      selectionStart,
      selectionEnd
    })
  }

  handleInputChange = text => {
    this.handleCursorChange()
    this.props.onChange(text)
  }

  render() {
    const { value } = this.props
    const { isCaps, isShift } = this.state
    const createInput = className => (
      <Input
        innerRef={el => (this.inputEl = el)}
        id="keyboardInput"
        value={value}
        onKeyUp={this.handleCursorChange}
        onClick={this.handleCursorChange}
        onInput={this.handleCursorChange}
        onChange={this.handleInputChange}
        className={cx(css(customInputStyle), className)}
      />
    )
    return (
      <React.Fragment>
        {this.props.children({
          ...this.props,
          isCaps,
          isShift,
          createInput,
          onButtonClick: this.handleButtonClick.bind(this)
        })}
      </React.Fragment>
    )
  }
}

export class Keyboard extends Component {
  render() {
    return (
      <AbstractKeyboard {...this.props}>
        {({ isCaps, isShift, createInput, onButtonClick }) => {
          const toCase = makeCase(isCaps || isShift)
          return (
            <KeyboardRoot>
              <div>
                {createInput(
                  css({
                    width: px(670)
                  })
                )}
              </div>
              {mapArrayIndexed((row, index) => {
                return (
                  <div key={index} css={buttonRowStyle}>
                    {map(({ label, value }) => {
                      const css = buttonStyles[value || label] || []
                      return (
                        <Button
                          alt
                          key={value || label}
                          onClick={e => onButtonClick(label)}
                          onMouseDown={e => {
                            // prevent losing focus
                            e.preventDefault()
                          }}
                          css={[customButtonStyle, ...css]}
                        >
                          {toCase(label)}
                        </Button>
                      )
                    }, row)}
                  </div>
                )
              }, rows)}
              <div css={spaceButtonRowStyle}>
                {map(({ label, value }) => {
                  return (
                    <Button
                      alt
                      key={value || label}
                      onClick={e => onButtonClick(label)}
                      css={spaceButtonStyle}
                      onMouseDown={e => {
                        // prevent losing focus
                        e.preventDefault()
                      }}
                    >
                      {toCase(label)}
                    </Button>
                  )
                }, row5)}
              </div>
            </KeyboardRoot>
          )
        }}
      </AbstractKeyboard>
    )
  }
}

export class StatefulKeyboard extends React.Component {
  state = {
    text: ''
  }

  render() {
    const { text } = this.state
    return (
      <Keyboard
        value={text}
        onChange={text => {
          this.setState({ text })
        }}
      />
    )
  }
}
