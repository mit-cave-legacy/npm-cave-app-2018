import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconChevLeft = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{
        transform: 'translate(5.333px, 29.269px)'
      }}
      d="M4.594-17.288l8.921,9.3a.534.534,0,0,1,0,.855l-1.6,1.656a.534.534,0,0,1-.855,0L.16-16.861A.578.578,0,0,1,0-17.288a.578.578,0,0,1,.16-.427l10.9-11.379q.374-.374.855.053l1.6,1.6a.534.534,0,0,1,0,.855Z"
    />
  </SvgIcon>
)

export default IconChevLeft
