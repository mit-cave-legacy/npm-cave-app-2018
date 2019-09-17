import React from 'react'
import * as PropTypes from 'prop-types'
import { cx, css } from 'react-emotion'
import { CheckBoxChecked, CheckBoxUnchecked } from '../icons'

import {
  greyBlue,
  radiantGraphite,
  lightBlue,
  mediumGrey,
  darkGrey,
  offWhite,
  px,
  fontWeightSemiBold,
  fontSizeMedium,
  standardBorder
} from '../theme'

const { string, func, bool } = PropTypes

const radioClass = css({
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
  },
  '>:first-child': {
    marginTop: 6
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
 * CheckBox
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
export const CheckBox = ({
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
      'cave-checkbox',
      radioClass,
      isChecked && activeClass,
      disabled && disabledClass,
      className
    )}
    onClick={onClick}
  >
    {isChecked ? <CheckBoxChecked /> : <CheckBoxUnchecked />}
    <div>{children}</div>
  </div>
)

CheckBox.propTypes = {
  onClick: func,
  isChecked: bool,
  label: string
}

export default CheckBox
