import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconDelete extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 14 14" fill={color} {...props}>
        <g
          id="icon_delete"
          transform="translate(-1443 573) rotate(-90)"
          data-name="icon/delete"
        >
          <path
            className="cls-2"
            id="_ionicons_svg_md-trash"
            d="M1.167,12.448A1.558,1.558,0,0,0,2.722,14H8.945A1.558,1.558,0,0,0,10.5,12.448V3.5H1.167Zm10.5-11.281H8.75L7.774,0H3.893L2.917,1.167H0V2.333H11.667Z"
            transform="translate(573 1444.167) rotate(90)"
          />
        </g>
      </SvgIcon>
    )
  }
}
