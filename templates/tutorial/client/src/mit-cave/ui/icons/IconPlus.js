import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconPlus extends React.PureComponent {
  render() {
    const { color = '#fff', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
        <defs />
        <g
          id="icon_plus"
          transform="translate(0 24) rotate(-90)"
          data-name="icon/plus"
        >
          <path
            id="_ionicons_svg_md-add"
            d="M120,109.6H109.6V120h-3.2V109.6H96v-3.2h10.4V96h3.2v10.4H120Z"
            transform="translate(120 -96) rotate(90)"
          />
        </g>
      </SvgIcon>
    )
  }
}
