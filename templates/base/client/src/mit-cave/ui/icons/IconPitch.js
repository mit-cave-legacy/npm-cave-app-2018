import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconPitch extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" fill={color} {...props}>
        <g
          id="icon_pitch"
          transform="translate(-1443 583) rotate(-90)"
          data-name="icon/pitch"
        >
          <g id="_ionicons_svg_md-code-working" transform="translate(527 1320)">
            <path
              className="cls-2"
              id="Path_5526"
              d="M40.486,140.112l-5.277-5.255L40.48,129.6,38.873,128,32,134.857l6.879,6.857Zm7.029,0,5.271-5.255L47.514,129.6l1.607-1.6L56,134.857l-6.879,6.857-1.607-1.6Z"
              data-name="Path 5526"
            />
            <path
              className="cls-2"
              id="Path_5527"
              d="M155.6,238.143h2.143V236H155.6ZM166.357,236h-2.143v2.143h2.143Zm-6.45,2.143h2.143V236h-2.143Z"
              transform="translate(-116.979 -102.214)"
              data-name="Path 5527"
            />
          </g>
        </g>
      </SvgIcon>
    )
  }
}
