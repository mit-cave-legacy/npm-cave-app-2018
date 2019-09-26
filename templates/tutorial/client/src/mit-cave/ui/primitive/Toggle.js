import React from 'react'
import styled, { css, cx } from 'react-emotion'
import {
  cancel,
  confirm,
  fontSizeMedium,
  fontWeightBold,
  fontWeightSemiBold,
  offWhite,
  px,
  standardBorder
} from '../theme'

const togglerClass = css({
  height: px(18),
  width: px(62),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: offWhite,
  fontWeight: fontWeightSemiBold,
  fontSize: fontSizeMedium,
  userSelect: 'none',
  position: 'relative',
  paddingRight: px(2),
  cursor: 'pointer'
})

const NO_OP = () => {}

/**
 * Toggler
 * @param value
 * @param togglerLabel
 * @param onToggle
 * @param className
 * @param props
 * @returns {*}
 * @constructor
 */
export const Toggler = ({
  value,
  togglerLabel,
  onToggle = NO_OP,
  className,
  ...props
}) => {
  return (
    <div
      className={cx(togglerClass, className)}
      onClick={() => onToggle(!value)}
      {...props}
    >
      {togglerLabel || (value ? 'on' : 'off')}
      <div
        css={{
          width: px(36),
          height: px(16),
          backgroundColor: cancel,
          borderRadius: px(16),
          overflow: 'hidden'
        }}
      >
        <div
          css={{
            backgroundColor: confirm,
            width: '100%',
            height: '100%',
            transform: value
                       ? 'translate3d(0,0,0)'
                       : `translate3d(${px(-36)},0,0)`,
            transition: 'transform .4s'
          }}
        />
      </div>
      <div
        css={{
          right: 0,
          backgroundColor: 'white',
          position: 'absolute',
          borderRadius: '100%',
          width: px(18),
          height: px(18),
          transform: value
                     ? `translate3d(${px(2)},0,0)`
                     : `translate3d(${px(-22)},0,0)`,
          transition: 'transform .4s'
        }}
      />
    </div>
  )
}

/**
 * Toggle
 * @param label
 * @param value
 * @param togglerLabel
 * @param onChange
 * @param className
 * @param props
 * @returns {*}
 * @constructor
 */
export const Toggle = ({
  label,
  value,
  togglerLabel,
  onChange = NO_OP,
  className,
  onClick, // ignore on-click handler for a toggle -- use onChange
  ...props
}) => (
  <div
    className={cx(
      css({
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: offWhite,
        fontSize: fontSizeMedium,
        fontWeight: fontWeightBold
      }),
      className
    )}
    onClick={() => onChange(!value)}
    {...props}
  >
    <div>{label}</div>
    <Toggler value={value} togglerLabel={togglerLabel} />
  </div>
)

export const AttributeToggle = styled(Toggle)({
    border: standardBorder,
    height: px(36),
    borderRadius: px(18),
    paddingLeft: px(16),
    paddingRight: px(16),
    fontSize: px(13),
    fontWeight: fontWeightSemiBold
  }, ({ readOnly }) => readOnly && ({
    border: `${px(1)} solid transparent`
  }),
  ({ changed }) => changed && ({
    borderLeftColor: `${confirm}!important`
  }))
