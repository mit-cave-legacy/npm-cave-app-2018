import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconMapMarker = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'scale(0.35)' }}
      d="M25,48.9c0,0-16.6-21.8-16.6-32.1c0-9.5,7-15.6,16.6-15.6c10,0,16.6,6.1,16.6,15.6C41.6,27,25,48.9,25,48.9z M25,3.9c-7.1,0-12.8,5.7-12.8,12.7c0,7,5.7,12.7,12.8,12.7c7.1,0,12.8-5.7,12.8-12.7C37.8,9.5,32.1,3.9,25,3.9z"
      id={props.id}
    />
  </SvgIcon>
)

export default IconMapMarker
