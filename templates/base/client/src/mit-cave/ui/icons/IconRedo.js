import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconRedo extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon height="16" width="16" viewBox="0 0 16 16" fill={color} {...props}>
        <g transform="translate(-3078 -1352)">
          <g transform="translate(3078 1368) rotate(-90)"
             data-name="icon/redo">
            <path
              d="M0,12.568H.1a.155.155,0,0,0,.146-.1,7.765,7.765,0,0,1,.764-1.418A8.71,8.71,0,0,1,4.388,8.069a8.34,8.34,0,0,1,3.467-.828.143.143,0,0,1,.15.143V10.3a.144.144,0,0,0,.221.121l7.709-5.077a.143.143,0,0,0,0-.239L8.223.025A.142.142,0,0,0,8,.146V3.1a.142.142,0,0,1-.136.143A8.312,8.312,0,0,0,2.032,5.577,7.587,7.587,0,0,0,0,11.244C0,11.612,0,12.147,0,12.568Z"
              transform="translate(14.001 0) rotate(90)" />
          </g>
        </g>
      </SvgIcon>
    )
  }
}
