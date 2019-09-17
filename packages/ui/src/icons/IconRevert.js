import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconRevert extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon height="24" width="24" viewBox="0 0 24 24" fill={color} {...props}>
        <g id="icon_restore" transform="translate(-1417 569) rotate(-90)"
           data-name="icon/restore">
          <rect height="24" id="Rectangle_210" width="24" fill="none"
                transform="translate(545 1417)" data-name="Rectangle 210" />
          <path id="_ionicons_svg_md-refresh"
                d="M12,21A9,9,0,0,1,12,3a8.719,8.719,0,0,1,6.3,2.7l-4.8,4.8H24V0L20.475,3.525A11.984,11.984,0,1,0,23.55,15.273H20.376A8.937,8.937,0,0,1,12,21Z"
                transform="translate(569 1417) rotate(90)" />
        </g>
      </SvgIcon>
    )
  }
}
