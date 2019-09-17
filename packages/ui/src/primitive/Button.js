import React from 'react'
import { cx, css } from 'react-emotion'
import * as R from 'ramda'

import {
  greyBlue,
  darkGrey,
  lightBlue,
  radiantGraphite,
  mediumGrey,
  offWhite,
  px,
  fontWeightRegular
} from '../theme'

const rootClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  fontWeight: fontWeightRegular,
  borderRadius: px(8),
  height: px(40),
  paddingLeft: px(16),
  paddingRight: px(16),
  cursor: 'pointer',
  color: offWhite,
  border: 'none',
  backgroundColor: greyBlue,
  zIndex: 0,
  textAlign: 'center',
  ':active': {
    backgroundColor: lightBlue,
    zIndex: 1
  },
  ':focus': {
    borderColor: lightBlue,
    zIndex: 1,
    outline: 'none',
    boxShadow: `0 0 ${px(28)} ${px(3)} rgba(16,94,231,0.32)`
  }
})

const altClass = css({
  border: `1px solid ${greyBlue}`,
  backgroundColor: radiantGraphite,
  ':active': {
    backgroundColor: darkGrey,
    borderColor: lightBlue
  },
  ':focus': {
    borderColor: lightBlue,
    boxShadow: '0px 0px 28px 3px rgba(16,94,231,0.32)'
  }
})

const disabledClass = css({
  color: darkGrey,
  pointerEvents: 'none'
})

const altAndDisabledClass = css({
  color: mediumGrey,
  pointerEvents: 'none'
})

const withIconClass = css({
  '& svg': { marginRight: px(8) }
})

const selectedClass = css({
  backgroundColor: lightBlue,
  zIndex: 1
})

/**
 * Button
 * @param selected
 * @param children
 * @param icon
 * @param className
 * @param rest
 * @returns {*}
 * @constructor
 */
export const Button = ({
  ref,
  innerRef,
  selected,
  children,
  icon,
  className,
  ...rest
}) => (
  <div
    onClick={e => {
      e.target.blur()
      if (rest.onClick) rest.onClick(e)
    }}
    className={cx(
      'cave-button',
      rootClass,
      {
        [altClass]: rest.alt && !rest.disabled,
        [disabledClass]: !rest.alt && rest.disabled,
        [altAndDisabledClass]: rest.alt && rest.disabled,
        [withIconClass]: icon,
        [selectedClass]: selected
      },
      className
    )}
    {...rest}
    ref={ref || innerRef}
  >
    {icon && icon}
    {icon && R.is(String, children) ? <div>{children}</div> : children}
  </div>
)
