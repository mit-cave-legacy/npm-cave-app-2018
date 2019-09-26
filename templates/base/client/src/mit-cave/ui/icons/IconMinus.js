import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconMinus extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" fill={color} {...props}>
        <g transform="translate(0 24) rotate(-90)" data-name="icon/minus">
          <path
            d="M96,235h24v3.15H96Z"
            transform="translate(249 -96) rotate(90)"
          />
        </g>
      </SvgIcon>
    )
  }
}
