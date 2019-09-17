import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

/*
<g id="icon_move" data-name="icon/move" transform="translate(-1443 583) rotate(-90)">
    <rect id="Rectangle_210" data-name="Rectangle 210" className="cls-1" width="24" height="24" rx="6" transform="translate(559 1443)"/>
    <path id="_ionicons_svg_md-move" className="cls-2" d="M56,44l-5.143-5.143v3.429H45.714V37.143h3.429L44,32l-5.143,5.143h3.429v5.143H37.143V38.857L32,44l5.143,5.143V45.714h5.143v5.143H38.857L44,56l5.143-5.143H45.714V45.714h5.143v3.429Z" transform="translate(615 1411) rotate(90)"/>
  </g>
 */

export const IconMove = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'translate(-32px, -32px)' }}
      d="M56,44l-5.143-5.143v3.429H45.714V37.143h3.429L44,32l-5.143,5.143h3.429v5.143H37.143V38.857L32,44l5.143,5.143V45.714h5.143v5.143H38.857L44,56l5.143-5.143H45.714V45.714h5.143v3.429Z"
    />
  </SvgIcon>
)

export default IconMove
