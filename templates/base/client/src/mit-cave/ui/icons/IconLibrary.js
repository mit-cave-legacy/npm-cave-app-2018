import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconLibrary = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'translate(-324px, 1932px)' }}
      d="M345.819-1929.976,336-1928.129l-9.819-1.846a2.035,2.035,0,0,0-2.181,2.169v14.105c0,1.195.923,1.881,2.181,2.169l9.819,1.841,9.819-1.846c1.258-.289,2.181-.975,2.181-2.169v-14.1A2.035,2.035,0,0,0,345.819-1929.976Zm0,16.269-8.723,1.846v-14.106l8.723-1.846ZM334.9-1911.86l-8.723-1.846v-14.1l8.723,1.846Z"
    />
  </SvgIcon>
)

export default IconLibrary
