import { G, Path, Rect } from 'glamorous'
import React from 'react'
import { confirm } from '../theme'

import { SvgIcon } from './SvgIcon'

export const CheckBoxChecked = ({ color = confirm, ...props }) => (
  <SvgIcon {...{ color, ...props }}>
    <G css={{ fill: 'none' }}>
      <Rect
        css={{ stroke: color }}
        x="0.5"
        y="0.5"
        width="15"
        height="15"
        rx="3.5"
      />
    </G>
    <G css={{ transform: 'translate(3.5px, 4px)' }}>
      <Path d="M8.957,1A.332.332,0,0,1,9,1.125a.332.332,0,0,1-.043.13L3.57,8.178q-.13.13-.195.13A.312.312,0,0,1,3.159,8.2L.108,5.257.043,5.192A.332.332,0,0,1,0,5.063a.379.379,0,0,1,.043-.108l.043-.043q.606-.649.952-1,.13-.13.173-.13a.354.354,0,0,1,.216.13L3.159,5.6,7.486.043A.176.176,0,0,1,7.615,0a.349.349,0,0,1,.151.043Z" />
    </G>
  </SvgIcon>
)
