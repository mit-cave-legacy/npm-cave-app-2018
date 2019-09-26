import React from 'react'
import { SvgIcon } from './SvgIcon'

export class IconOptions extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      <SvgIcon viewBox="0 0 24 24" fill={color} {...props}>
        <g
          id="icon_options"
          transform="translate(-1443 583) rotate(-90)"
          data-name="icon/options"
        >
          <g
            id="_ionicons_svg_md-options"
            transform="translate(615 1411) rotate(90)"
          >
            <path
              className="cls-2"
              id="Path_5511"
              d="M32,323.429H46.571v1.714H32Zm19.714,0H56v1.714H51.714Zm-.857,3.4a1.714,1.714,0,1,1-3.429,0v-5.089a1.714,1.714,0,1,1,3.429,0Z"
              transform="translate(0 -272.571)"
              data-name="Path 5511"
            />
            <g
              id="Group_4647"
              transform="translate(32 39.714)"
              data-name="Group 4647"
            >
              <path
                className="cls-2"
                id="Path_5512"
                d="M32,179.429h4.286v1.714H32Zm9.429,0H56v1.714H41.429Zm-.857,3.4a1.714,1.714,0,1,1-3.429,0v-5.089a1.714,1.714,0,1,1,3.429,0Z"
                transform="translate(-32 -176)"
                data-name="Path 5512"
              />
            </g>
            <g
              id="Group_4648"
              transform="translate(32 32)"
              data-name="Group 4648"
            >
              <path
                className="cls-2"
                id="Path_5513"
                d="M32,35.429H46.571v1.714H32Zm19.714,0H56v1.714H51.714Zm-.857,3.4a1.714,1.714,0,1,1-3.429,0V33.741a1.714,1.714,0,1,1,3.429,0Z"
                transform="translate(-32 -32)"
                data-name="Path 5513"
              />
            </g>
          </g>
        </g>
      </SvgIcon>
    )
  }
}
