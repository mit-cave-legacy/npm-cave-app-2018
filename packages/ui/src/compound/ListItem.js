import glam from 'glamorous'
import React from 'react'
import { IconChevRight } from '../icons/IconChevRight'

import {
  greyBlue,
  lightBlue,
  mediumGrey,
  offWhite,
  px,
  radiantGraphite
} from '../theme'

/**
 * Item
 * @type {GlamorousComponent<{disabled: *} & React.HTMLProps<HTMLDivElement>, {disabled: *}>}
 */
const Item = glam.div(
  {
    fontSize: px(15),
    fontWeight: 100,
    height: px(40),
    width: px(320),
    padding: `${px(0)} ${px(16)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: offWhite,
    outline: 'none',
    backgroundColor: `${radiantGraphite}`,
    border: `${px(1)} solid ${greyBlue}`
  },
  ({ disabled }) =>
    disabled
      ? {
          backgroundColor: `${radiantGraphite}`,
          pointerEvents: 'none',
          color: mediumGrey,
          '& svg path': {
            fill: mediumGrey
          },
          ':active': {
            backgroundColor: 'none'
          },
          ':focus': {
            backgroundColor: 'none',
            border: `${px(1)} solid ${greyBlue}`,
            boxShadow: 'none'
          }
        }
      : {},
  ({ onClick }) =>
    onClick && {
      ':active': {
        backgroundColor: lightBlue
      },

      ':focus': {
        border: `${px(1)} solid ${lightBlue}`,
        boxShadow: `${px(0)} ${px(0)} ${px(14)} ${px(0)} rgba(16,94,231,0.4)`
      }
    }
)

/**
 * ListItem
 * @param children
 * @param itemName
 * @param props
 * @returns {*}
 * @constructor
 */
export const ListItem = ({ children, itemName, ...props }) => (
  <Item {...props} tabIndex="1">
    {itemName}
    {children}
    {props.onClick && <IconChevRight size={px(16)} color={lightBlue} />}
  </Item>
)
