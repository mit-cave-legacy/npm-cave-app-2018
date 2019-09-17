import React from 'react'
import glam from 'glamorous'
import { darkGrey, px } from '../theme'

// every base (parent) component's glam component should be named 'ComponentNameRoot'
const BadgeRoot = glam.div(
  'badge', // class name (optional), helpful to debug in browser
  { propsAreCssOverrides: true }, // propsAreCssOverrides (optional) so that you can override css as prop (<BadgeRoot css={{}}> in the render function)
  {
    // necessary stylings
    fontSize: px(15),
    fill: darkGrey,
    fontWeight: 'normal',
    borderRadius: px(16),
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EFEFEF',
    backgroundColor: darkGrey,
    padding: `${px(7)} ${px(8)}`
  },
  ({ size = px(28) }) => ({
    // if there are props...
    minWidth: size,
    width: 'auto',
    height: size
  }),
  ({ label }) => {
    if (label) {
      if (label.length === 1) {
        return {
          textAlign: 'center',
          padding: 0
        }
      } else if (label.length === 2) {
        return {
          textAlign: 'center',
          padding: `${px(3)} ${px(7)}`
        }
      } else {
        return {
          textAlign: 'center',
          padding: `${px(7)} ${px(8)}`
        }
      }
    }
  }
)

/**
 * A simple badge component
 * @param children
 * @param label
 * @param icon
 * @param props
 * @returns {*}
 * @constructor
 */
export const Badge = ({ label, icon, children, ...props }) => (
  <BadgeRoot {...props}>
    {label && label}
    {icon && icon}
  </BadgeRoot>
)
