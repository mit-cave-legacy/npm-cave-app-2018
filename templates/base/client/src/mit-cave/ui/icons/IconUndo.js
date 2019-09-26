import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconUndo extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon height="16" width="16" viewBox="0 0 16 16" fill={color} {...props}>
        <g transform="translate(-2941 -1352)">
          <g transform="translate(2941 1368) rotate(-90)">
            <path d="M15.993,11.245a7.587,7.587,0,0,0-2.028-5.667A8.325,8.325,0,0,0,8.13,3.24.144.144,0,0,1,7.995,3.1V.144A.144.144,0,0,0,7.773.023L.064,5.1a.143.143,0,0,0,0,.239l7.709,5.077a.142.142,0,0,0,.221-.121V7.382a.143.143,0,0,1,.15-.143,8.4,8.4,0,0,1,3.467.828,8.793,8.793,0,0,1,3.374,2.981,7.646,7.646,0,0,1,.764,1.418.158.158,0,0,0,.146.1H16C16,12.149,15.993,11.613,15.993,11.245Z"
                  transform="translate(14 0) rotate(90)" />
          </g>
        </g>
      </SvgIcon>
    )
  }
}
