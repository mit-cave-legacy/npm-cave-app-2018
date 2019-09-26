import React from 'react'
import { InputterContext } from '../primitive'
import { px } from '../theme'
import { ConfirmInputter, LiveInputter } from './Inputter'

/**
 * Makes inputter work with other content in a container.
 */
export class WithInputter extends React.Component {
  state = {}

  grabKeyboard(fieldName, type, initialValue, onChange) {
    this.setState({
      fieldName,
      type,
      initialValue,
      onChange
    })
  }

  releaseKeyboard() {
    this.setState({
      fieldName: null,
      type: null,
      initialValue: undefined
    })
  }

  updateValue(value) {
    if (!this.props.liveInput) return
    if (value === this.state.value) return
    this.setState({
      value
    })
  }

  constructor(props) {
    super(props)
    this._value = {
      grabKeyboard: this.grabKeyboard.bind(this),
      releaseKeyboard: this.releaseKeyboard.bind(this),
      updateValue: this.updateValue.bind(this)
    }
  }

  render() {
    const {
      autoInput,
      inputOnLeft,
      inputter,
      width,
      liveInput,
      children
    } = this.props
    const w = width ? `${px(width)}!important` : 'auto'
    const css = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      /* first child is the actual content */
      '&>:first-child': {
        width: w,
        minWidth: w,
        maxWidth: w,
        height: '100%',
        order: inputOnLeft ? 1 : 0
      },
      /* inputter with standard inputter padding */
      '&>:last-child': {
        order: inputOnLeft ? 0 : 1
      }
    }
    if (!autoInput)
      return (
        <div css={css}>
          {children}
          {React.cloneElement(inputter, { onLeft: inputOnLeft })}
        </div>
      )

    /* autoInput support */
    const { fieldName, type, initialValue, value, onChange } = this.state
    const onConfirm = value => {
      if (onChange) onChange(value)
      this.releaseKeyboard()
    }
    const onCancel = () => {
      this.releaseKeyboard()
    }
    const autoInputType = liveInput ? LiveInputter : ConfirmInputter
    const autoInputter = React.createElement(autoInputType, {
      onLeft: inputOnLeft,
      liveInput,
      fieldName,
      type,
      initialValue,
      value,
      onChange,
      onConfirm,
      onCancel
    })
    return (
      <div css={css}>
        <InputterContext.Provider
          value={{
            ...this._value,
            fieldId: fieldName,
            onConfirm,
            onCancel
          }}
        >
          {children}
        </InputterContext.Provider>
        {autoInputter}
      </div>
    )
  }
}
