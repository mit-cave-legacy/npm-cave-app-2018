import React from 'react'
import { css, cx } from 'react-emotion'
import { fontWeightBold, px } from '../theme'
import { withFieldLabel } from '../primitive'

export const toggleButtonClass = css({
  label: 'cave-toggle-buttons',
  display: 'flex',
  justifyContent: 'space-between',
  '& .cave-button': {
    position: 'relative',
    borderRadius: 0,
    fontWeight: fontWeightBold,
    flex: 1,
    marginRight: px(-1), // in order to remove double border
    '&:first-child': {
      borderTopLeftRadius: px(8),
      borderBottomLeftRadius: px(8)
    },
    '&:last-child': {
      borderTopRightRadius: px(8),
      borderBottomRightRadius: px(8)
    }
  }
})

/**
 * ToggleButtonsNoLabel
 * @param label
 * @param onSelect
 * @param className
 * @param value
 * @param children
 * @returns {*}
 * @constructor
 */
const ToggleButtonsNoLabel = ({
  label,
  onSelect,
  className,
  value,
  children
}) => (
  <div className={cx(toggleButtonClass, className)}>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        alt: child.props.alt !== undefined ? child.props.alt : true,
        selected: value !== undefined && child.props.value === value,
        onClick: () => child.props.onClick || onSelect(child.props.value)
      })
    )}
  </div>
)

export const ToggleButtons = withFieldLabel(
  'ToggleButtons',
  ToggleButtonsNoLabel
)

export const ButtonGroup = ToggleButtons
