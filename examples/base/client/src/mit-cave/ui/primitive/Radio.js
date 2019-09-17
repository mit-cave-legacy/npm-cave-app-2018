import React from 'react'
import * as PropTypes from 'prop-types'
import { cx, css } from 'react-emotion'

import {
  greyBlue,
  radiantGraphite,
  lightBlue,
  mediumGrey,
  darkGrey,
  offWhite,
  confirm,
  px,
  fontWeightSemiBold,
  fontSizeMedium,
  standardBorder
} from '../theme'

const { string, func, bool } = PropTypes

const singleRadioClass = css({
  height: px(40),
  backgroundColor: radiantGraphite,
  display: 'flex',
  color: offWhite,
  alignItems: 'center',
  fontSize: fontSizeMedium,
  fontWeight: fontWeightSemiBold,
  cursor: 'pointer',
  border: standardBorder,
  whiteSpace: 'nowrap',
  /* TODO (possible): when not in a group, apparently padding is 11 -- BUT, no concept of a radio by itself */
  paddingLeft: px(16), // 24-16/2
  paddingRight: px(16),
  ':active': {
    backgroundColor: darkGrey,
    border: `${px(1)}  solid ${lightBlue}`,
    zIndex: 1
  },
  ':first-child': {
    borderTopLeftRadius: px(8),
    borderTopRightRadius: px(8)
  },
  ':last-child': {
    borderBottomLeftRadius: px(8),
    borderBottomRightRadius: px(8)
  },
  ':not(:first-child)': {
    marginTop: -1
  },
  userSelect: 'none',
  /* change size if in a drop down */
  '.cave-dropdown &': {
    height: px(50),
    borderTopLeftRadius: '0!important',
    borderTopRightRadius: '0!important'
  }
})

const activeClass = css({
  backgroundColor: darkGrey,
  border: `${px(1)}  solid ${lightBlue}`,
  zIndex: 1
})

const disabledClass = css({
  pointerEvents: 'none',
  border: `${px(1)} solid ${greyBlue}`,
  color: mediumGrey
})

/**
 * RadioDot
 * @param className
 * @param isChecked
 * @returns {*}
 * @constructor
 */
export const RadioDot = ({ className, isChecked }) => (
  <svg
    className={cx(
      css({ height: px(16), width: px(16), marginRight: 8 }),
      className
    )}
  >
    <circle css={{ fill: 'none', stroke: confirm }} cx="8" cy="8" r="7.5" />
    {isChecked && <circle css={{ fill: confirm }} cx="8" cy="8" r="4" />}
  </svg>
)

/**
 * Radio
 * @param className
 * @param children
 * @param id
 * @param onClick
 * @param isChecked
 * @param label
 * @param name
 * @param value
 * @param disabled
 * @returns {*}
 * @constructor
 */
export const Radio = ({
  className,
  children,
  id,
  onClick,
  isChecked,
  label,
  name,
  value,
  disabled
}) => (
  <div
    className={cx(
      'cave-radio',
      singleRadioClass,
      isChecked && activeClass,
      disabled && disabledClass,
      className
    )}
    onClick={onClick}
  >
    <RadioDot isChecked={isChecked} css={{ marginRight: 8 }} />
    <div css={{ paddingTop: px(1) }}>{label}</div>
  </div>
)

Radio.propTypes = {
  onClick: func,
  isChecked: bool,
  label: string
}

export default Radio
