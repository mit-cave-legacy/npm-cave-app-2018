import { Rect } from 'glamorous'
import React from 'react'
import { greyBlue } from '../theme'

import { SvgIcon } from './SvgIcon'

export const CheckBoxUnchecked = ({ color = greyBlue, ...props }) => (
  <SvgIcon {...{ color, ...props }}>
    <Rect
      css={{ fill: 'none', stroke: color }}
      x="0.5"
      y="0.5"
      width="15"
      height="15"
      rx="3.5"
    />
  </SvgIcon>
)
