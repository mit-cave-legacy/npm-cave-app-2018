import React from 'react'

export const InputterContext = React.createContext()
let fieldIds = 1
export const withAutoInput = (name, component) => {
  return class withAutoInput extends React.PureComponent {
    static displayName = `withAutoInput(${name})`

    constructor(props) {
      super(props)
      this._fieldId = fieldIds++
    }

    componentWillUnmount() {
      if (this.releaseKeyboard) this.releaseKeyboard()
    }

    render() {
      const { onChange, type = 'keyboard', value, ...rest } = this.props
      if (!(onChange && value !== undefined)) {
        return React.createElement(component, this.props)
      }
      const myFieldId = this._fieldId
      return (
        <InputterContext.Consumer>
          {ctxt => {
            if (!ctxt) return React.createElement(component, this.props)
            const { fieldId, grabKeyboard, releaseKeyboard, updateValue } = ctxt
            this.releaseKeyboard = releaseKeyboard
            const onClick = () => {
              grabKeyboard(myFieldId, type, value, onChange)
            }
            const isActive = fieldId === myFieldId
            if (isActive) {
              updateValue(value)
            }
            return React.createElement(component, {
              ...rest,
              isActive,
              value,
              onClick
            })
          }}
        </InputterContext.Consumer>
      )
    }
  }
}
