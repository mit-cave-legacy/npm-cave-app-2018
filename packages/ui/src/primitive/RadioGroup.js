import React, { Children, cloneElement } from 'react'
import { cx, css } from 'react-emotion'
import * as R from 'ramda'
import { withFieldLabel } from './FieldLabel'

const radioGroupRootClass = css({
  display: 'flex',
  flexDirection: 'column'
})

/**
 * RadioGroupInner
 * @param className
 * @param children
 * @param onSelect
 * @param value
 * @param props
 * @returns {*}
 * @constructor
 */
export const RadioGroupInner = ({ className, children, onSelect, value }) => (
  <div role="radiogroup" className={cx(radioGroupRootClass, className)}>
    {Children.map(children, child => {
      return cloneElement(child, {
        isChecked: R.equals(child.props.value, value),
        onClick: () => child.props.onClick || onSelect(child.props.value)
      })
    })}
  </div>
)

export const RadioGroup = withFieldLabel('RadioGroup', RadioGroupInner)
