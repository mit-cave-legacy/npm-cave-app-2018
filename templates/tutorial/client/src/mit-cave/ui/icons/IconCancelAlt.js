import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconCancelAlt extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" fill={color} {...props}>
        <defs />
        <g
          id="icon_cancel-alt"
          transform="translate(-1443 583) rotate(-90)"
          data-name="icon/cancel-alt"
        >
          <g id="Group_4334" transform="translate(65)" data-name="Group 4334">
            <path
              className="cls-2"
              id="Path_5252"
              d="M60,50.423a9.573,9.573,0,1,1-6.773,2.8A9.537,9.537,0,0,1,60,50.423M60,48A12,12,0,1,0,72,60,12,12,0,0,0,60,48Z"
              transform="translate(566 1395) rotate(90)"
              data-name="Path 5252"
            />
            <path
              className="cls-2"
              id="Path_5253"
              d="M169.35,237.423H149V235h20.35Z"
              transform="translate(785.751 1509.302) rotate(135)"
              data-name="Path 5253"
            />
          </g>
        </g>
      </SvgIcon>
    )
  }
}
