import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconLocate extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" fill={color} {...props}>
        <path
          d="M44,39.714A4.286,4.286,0,1,0,48.286,44,4.3,4.3,0,0,0,44,39.714Zm10.229,3.143a10.325,10.325,0,0,0-9.086-9.086V32H42.857v1.771a10.325,10.325,0,0,0-9.086,9.086H32v2.286h1.771a10.325,10.325,0,0,0,9.086,9.086V56h2.286V54.229a10.325,10.325,0,0,0,9.086-9.086H56V42.857ZM44,52a8,8,0,1,1,8-8A8.023,8.023,0,0,1,44,52Z"
          transform="translate(-32 -32)"
        />
      </SvgIcon>
    )
  }
}
