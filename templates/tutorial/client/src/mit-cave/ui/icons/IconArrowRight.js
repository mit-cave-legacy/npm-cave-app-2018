import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconArrowRight = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path d="M0,13.5H18.225l-8.4,8.4L12,24,24,12,12,0,9.9,2.1l8.325,8.4H0Z" />
  </SvgIcon>
)

export default IconArrowRight
