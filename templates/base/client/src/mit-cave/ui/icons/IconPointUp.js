import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconPointUp = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'rotate(180deg)', transformOrigin: 'center' }}
      d="M0 6,12 18,24 6Z"
    />
  </SvgIcon>
)

export default IconPointUp
