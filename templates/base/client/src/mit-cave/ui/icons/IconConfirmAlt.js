import { Circle, Line } from 'glamorous'
import React from 'react'
import { greyBlue } from '../theme'
import { confirm } from '../theme.js'
import { SvgIcon } from './SvgIcon'

export const IconConfirmAlt = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 42 42" {...{ color, ...props }}>
    <Circle
      css={{ stroke: greyBlue, fill: 'none', strokeWidth: '0' }}
      cx="21"
      cy="21"
      r="20"
    />
    <Line
      x1="19.4"
      y1="27.3"
      x2="29.6"
      y2="14.2"
      css={{ stroke: confirm, strokeWidth: '2' }}
    />
    <Line
      x1="20.3"
      y1="26.7"
      x2="14.9"
      y2="22.4"
      css={{ stroke: confirm, strokeWidth: '2' }}
    />
  </SvgIcon>
)

export default IconConfirmAlt
//#39404C
