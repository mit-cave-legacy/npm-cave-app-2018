import React from 'react'
import styled from 'react-emotion'
import { fontSizeMedium, fontWeightSemiBold, offWhite, px } from '../theme'

/**
 * Standalone labels that go above all non-compact fields
 * @type {StyledOtherComponent<object, JSX.IntrinsicElements[[string]], Theme>}
 */
export const FieldLabel = styled('div')({
  label: 'cave-form-field-label',
  marginBottom: px(6),
  fontSize: fontSizeMedium,
  fontWeight: fontWeightSemiBold,
  color: offWhite
})

/**
 * withFieldLabel adds a standard field label to a standard control
 * Intended for use primarily with core components
 * @param name
 * @param component
 * @returns {{displayName, new(): withFieldLabel, prototype: withFieldLabel}}
 */
export const withFieldLabel = (name, component) => {
  return class withFieldLabel extends React.Component {
    static displayName = `withFieldLabel(${name})`

    render() {
      const { label, ...props } = this.props
      if (!label) return React.createElement(component, props)
      return (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          <FieldLabel>{label}</FieldLabel>
          {React.createElement(component, props)}
        </div>
      )
    }
  }
}
