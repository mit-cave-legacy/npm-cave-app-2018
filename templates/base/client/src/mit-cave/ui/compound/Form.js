import React from 'react'
import styled, { css, cx } from 'react-emotion'
import { important, px, standardBorder } from '../theme'
import { List } from './List'

/**
 * A form container for non-compact normal forms (not map/scenario objects)
 * @type {StyledOtherComponent<object, JSX.IntrinsicElements[[string]], Theme>}
 */
export const BigForm = styled(List)({
  label: 'cave-form',
  paddingLeft: px(24),
  paddingRight: px(24),
  paddingTop: px(16),
  paddingBottom: px(16),
  '&>:not(:last-child)': {
    marginBottom: px(16)
  }
})
export const Form = BigForm

/**
 * A compact attribute form
 * Children (which should be attributes) can supply a `name` field which will
 * be used to raise onClickAttribute events. Alternately, you can wire
 * each attribute separately.
 * @type {StyledStatelessComponent<object, object, Theme>}
 */
export const AttributeForm = ({
  activeAttribute,
  onOpenAttribute = () => {},
  className,
  children
}) => (
  <BigForm
    className={cx(
      css({
        label: 'cave-form-compact',
        '&>*': {
          cursor: 'pointer'
        },
        '&>:not(:last-child)': {
          marginBottom: px(12)
        }
      }),
      className
    )}
  >
    {React.Children.map(children, child =>
      child.props.name
        ? React.cloneElement(child, {
            isActive: child.props.name === activeAttribute,
            onClick: () => onOpenAttribute(child.props.name)
          })
        : child
    )}
  </BigForm>
)

/**
 * A linethat separates a form
 * @type {StyledOtherComponent<object, JSX.IntrinsicElements[[string]], Theme>}
 */
export const FormSeparator = styled('div')({
  borderBottom: standardBorder,
  marginTop: important(px(20 - 16)),
  marginBottom: important(px(20))
})
