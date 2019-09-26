import React from 'react'
import glam from 'glamorous'
import { confirm, px } from '../theme'

const BadgeForMessageRoot = glam.div(
  { propsAreCssOverrides: true },
  {
    height: px(12),
    width: px(12),
    margin: `0 ${px(8)} 0 0`,
    padding: `${px(12)} 0 0 0`,
    fontSize: px(15),
    fontWeight: 'normal',
    borderRadius: px(16),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EFEFEF',
    backgroundColor: confirm // default color
  }
)

/**
 * BadgeForMessage
 * @param label
 * @param children
 * @param props
 * @returns {React.Component}
 * @constructor
 */
export const BadgeForMessage = ({ label, children, ...props }) => (
  <BadgeForMessageRoot {...props}>{label}</BadgeForMessageRoot>
)
