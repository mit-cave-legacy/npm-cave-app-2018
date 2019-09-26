import React from 'react'
import { offWhite } from '../theme'

export class IconExpand extends React.PureComponent {
  render() {
    const { className, width = 24, height = 24, fill = offWhite } = this.props
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
      >
        <defs />
        <g transform="translate(-1443 583) rotate(-90)" data-name="icon/expand">
          {/*<rect height='24' width='24' rx='6' transform='translate(559 1443)' data-name='Rectangle 210' />*/}
          <path
            d="M84.8,84.8H80V88h8V80H84.8Zm0-17.6V72H88V64H80v3.2Zm-17.6,0H72V64H64v8h3.2Zm0,17.6V80H64v8h8V84.8Z"
            transform="translate(647 1379) rotate(90)"
          />
        </g>
      </svg>
    )
  }
}
