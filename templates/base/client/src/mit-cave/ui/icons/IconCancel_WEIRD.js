import { Circle, Line } from 'glamorous'
import React from 'react'
import { greyBlue } from '../theme'
import { cancel } from '../theme.js'
import { SvgIcon } from './SvgIcon'

export const IconCancelAlt = ({ color = 'none', ...props }) => (
  <SvgIcon viewBox="0 0 42 42" {...{ color, ...props }}>
    <Circle
      css={{ stroke: greyBlue, fill: 'none', strokeWidth: '0' }}
      cx="21"
      cy="21"
      r="20"
    />
    <Line
      x1="15.1"
      y1="26.6"
      x2="26.4"
      y2="15.2"
      css={{ stroke: cancel, strokeWidth: '2' }}
    />
    <Line
      x1="26.4"
      y1="26.6"
      x2="15.1"
      y2="15.2"
      css={{ stroke: cancel, strokeWidth: '2' }}
    />
  </SvgIcon>
)

export default IconCancelAlt

//#39404C
