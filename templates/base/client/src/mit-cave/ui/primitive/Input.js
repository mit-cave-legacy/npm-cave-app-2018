import * as R from 'ramda'
import React from 'react'
import glam from 'glamorous'
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

const InputRoot = glam.input(
  {
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
  },
  ({ disabled }) =>
    disabled
      ? {
          backgroundColor: `${radiantGraphite}`,
          '::placeholder': {
            color: `${mediumGrey}`
          }
        }
      : {}
)
/**
 * Label-less input, with value ALWAYS CONTROLLED
 * @param onChange
 * @param value
 * @param props
 * @returns {*}
 * @constructor
 */
export const InputNoLabel = ({
  onChange = R.always(null),
  value = '',
  ...props
}) => (
  <InputRoot
    onChange={e => onChange(e.target.value)}
    value={value}
    label={null}
    {...props}
  />
)

/**
 * An input for use with the soft keyboard
 * @type {{displayName, new(): withFieldLabel, prototype: withFieldLabel}}
 */
export const Input = withFieldLabel('Input', InputNoLabel)

export const TextField = Input
