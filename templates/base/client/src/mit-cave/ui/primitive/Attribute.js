import React from 'react'
import {
  fontWeightSemiBold,
  greyBlue,
  lightBlue,
  lightGrey,
  offWhite,
  px,
  confirm,
  radiantGraphite
} from '../theme'
import styled, { cx, css } from 'react-emotion'
import { withAutoInput } from './withAutoInput'

const AttributeRoot = styled('div')(
  {
    label: 'cave-attribute',
    display: 'flex',
    paddingLeft: px(16),
    paddingRight: px(16),
    justifyContent: 'space-between',
    alignItems: 'center',

    height: px(36),
    '&>*': {
      flex: 1
    },
    borderRadius: px(36),
    fontSize: px(13),
    '&>:first-child': {
      fontWeight: fontWeightSemiBold
    }
  },
  ({ readOnly }) => readOnly && ({
    borderColor: `transparent!important`,
  }),
  ({ changed }) => changed && ({
    borderLeftColor: `${confirm}!important`
  }),
  ({ isActive }) => ({
    border: isActive
            ? `${px(1)} solid ${lightBlue}`
            : `${px(1)} solid ${greyBlue}`
  }),
)

const AttributeMultiRoot = styled('div')({
  label: 'cave-multi-attribute',
  borderRadius: px(18),
  padding: `${px(10)} 0`,
  display: 'grid',
  color: offWhite,
  border: `${px(1)} solid ${greyBlue}`,
  backgroundColor: radiantGraphite,
  '&>:not(:last-child)': {
    marginBottom: px(12)
  },
  '& .cave-attribute': {
    border: 'none',
    height: 'auto',
    borderRadius: 'none'
  }
})

/**
 * The standard "input" -- really a display surface that is touchable -- for an
 * attribute displayed in a "compact form". Compact forms are used where there is an entity
 * that needs editing, like a node or arc. Regular forms are used for everything else.
 * @param label
 * @param value
 * @param children
 * @param className
 * @param props
 * @returns {*}
 * @constructor
 */
export const Attribute = withAutoInput(
  'Attribute',
  ({ isActive, readOnly, label, value, children, className, ...props }) => (
    <AttributeRoot
      isActive={isActive}
      readOnly={readOnly}
      className={cx('cave-attribute', className)}
      {...props}
    >
      <div>{label}</div>
      {value || children}
    </AttributeRoot>
  )
)

/**
 * A special attribute that display a single multi-part value which is atomically editable.
 * In other words, the editor through some interactive UI changes all of the values at once,
 * not each attribute individually.
 * Children should be Attributes
 * @param children
 * @param props
 * @returns {*}
 * @constructor
 */
export const AttributeMulti = ({ children, ...props }) => (
  <AttributeMultiRoot {...props}>{children}</AttributeMultiRoot>
)
