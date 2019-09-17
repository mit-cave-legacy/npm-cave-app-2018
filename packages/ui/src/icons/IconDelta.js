import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconDelta extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon height="24" width="24" viewBox="0 0 24 24" fill={color} {...props}>
        <g id="icon_edit" transform="translate(-1450 577) rotate(-90)"
           data-name="icon/edit">
          <rect height="24" id="Rectangle_210" width="24" fill="none"
                transform="translate(553 1450)" data-name="Rectangle 210" />
          <path id="_ionicons_svg_md-create"
                d="M64,83v5h5L83.733,73.267l-5-5ZM87.6,69.4a1.289,1.289,0,0,0,0-1.867L84.467,64.4a1.289,1.289,0,0,0-1.867,0l-2.467,2.467,5,5Z"
                fill="#ededed" transform="translate(641 1386) rotate(90)" />
        </g>
      </SvgIcon>
    )
  }
}
