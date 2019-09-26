import React from 'react'
import { css, cx } from 'react-emotion'
import { withFieldLabel } from './FieldLabel'

import {
  greyBlue,
  radiantGraphite,
  mediumGrey,
  offWhite,
  lightBlue,
  darkGrey,
  px
} from '../theme'
import { withAutoInput } from './withAutoInput'

const mainCls = css({
  label: 'big-attribute',
  fontSize: px(13),
  height: px(36),
  fontWeight: '100',
  borderRadius: px(32),
  paddingLeft: px(16),
  color: `${offWhite}`,
  outline: 'none',
  backgroundColor: `${radiantGraphite}`,
  border: `${px(1)} solid ${greyBlue}`,
  resize: 'none',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    backgroundColor: '#21232A'
  },
  ':active': {
    backgroundColor: darkGrey,
    border: `${px(1)} solid ${lightBlue}`
  },
  ':focus': {
    backgroundColor: darkGrey,
    border: `${px(1)} solid ${lightBlue}`
  },
  '::placeholder': {
    fontWeight: '100',
    color: `${offWhite}`
  },
  ':disabled': {
    pointerEvents: 'none'
  }
})
const disabledCls = css({
  backgroundColor: `${radiantGraphite}`
})
const activeCls = css({
  border: `${px(1)} solid ${lightBlue}`
})
const BigAttributeRoot = ({
  value,
  disabled,
  isActive,
  children,
  className,
  ...props
}) => (
  <div
    className={cx(
      mainCls,
      disabled && disabledCls,
      isActive && activeCls,
      className
    )}
    {...props}
  >
    {value || children}
  </div>
)

export const BigAttribute = withAutoInput(
  'BigAttribute',
  withFieldLabel('BigAttribute', BigAttributeRoot)
)
export const TextField = BigAttribute
