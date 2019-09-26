import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconMap = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'translate(-196px, 1175px)' }}
      d="M219.333-1175a2.119,2.119,0,0,0-.574.2l-6.76,2.6-8-2.8-7.533,2.533a.662.662,0,0,0-.467.667v20.133a.63.63,0,0,0,.667.667,2.891,2.891,0,0,0,.568-.207L204-1153.8l8,2.8,7.533-2.533a.662.662,0,0,0,.467-.667v-20.133A.63.63,0,0,0,219.333-1175ZM212-1153.667l-8-2.8v-15.867l8,2.8Z"
    />
  </SvgIcon>
)

export default IconMap
