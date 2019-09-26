import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconAdd = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path d="M12,2.423a9.573,9.573,0,1,1-6.773,2.8A9.537,9.537,0,0,1,12,2.423ZM12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Z" />
    <Path d="M18.146,13.185 H13.185 v4.961 H10.762 V13.185 H5.8 V10.761 H10.762 V5.8 H13.185 V10.761 h4.962 Z" />
  </SvgIcon>
)

export default IconAdd
