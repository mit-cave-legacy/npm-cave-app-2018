import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconCalculate extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
        <g
          id="icon_calculate"
          transform="translate(-1443 583) rotate(-90)"
          data-name="icon/calculate"
        >
          <path
            className="cls-2"
            id="_ionicons_svg_md-flash"
            d="M160,48V60.923h3.692V72l7.385-14.769h-3.692L171.077,48Z"
            transform="translate(631 1289) rotate(90)"
          />
        </g>
      </SvgIcon>
    )
  }
}
