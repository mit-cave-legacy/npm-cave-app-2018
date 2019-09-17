import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconChart extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" color={color} {...props}>
        <defs />
        <g transform="translate(-1450 577) rotate(-90)" data-name="icon/layers">
          <path
            className="cls-2"
            id="_ionicons_svg_md-stats"
            d="M86,64h4V88H86ZM80,81h4v7H80Zm12-4h4V88H92Zm6-6h4V88H98Z"
            transform="translate(641 1371) rotate(90)"
          />
        </g>
      </SvgIcon>
    )
  }
}
