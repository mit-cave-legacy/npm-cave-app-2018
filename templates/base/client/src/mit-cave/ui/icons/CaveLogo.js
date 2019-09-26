import React from 'react'
import { px } from '../theme'

export class CaveLogo extends React.PureComponent {
  render() {
    const { className, ...rest } = this.props
    return (
      <svg
        height={px(32)}
        viewBox="0 0 101.869 32"
        className={className}
        {...rest}
      >
        <defs />
        <g
          id="Group_4376"
          transform="translate(-519 -471.999)"
          data-name="Group 4376"
        >
          <path
            fill="#E7B809"
            id="Path_5249"
            d="M32.008,37.255v4.481l-7.978-8,7.978-7.978v4.5H46.56a16,16,0,1,0,0,6.994Z"
            transform="translate(504.051 454.241)"
            data-name="Path 5249"
          />
          <path
            fill="#AEB94C"
            id="Path_5250"
            d="M80.38,30.481H92.549V18.14A16.021,16.021,0,0,0,80.38,30.481ZM99.542,18.145V30.481H111.7A16.021,16.021,0,0,0,99.542,18.145Zm0,31.234a16.026,16.026,0,0,0,12.045-11.787H99.542Zm-6.994,0V37.593H80.5A16.026,16.026,0,0,0,92.549,49.385Z"
            transform="translate(473.82 454.065)"
            data-name="Path 5250"
          />
          <path
            fill="#76B3CE"
            id="Path_5251"
            d="M164.674,18.28V30.788H177.1A16.02,16.02,0,0,0,164.674,18.28Zm0,19.732H157.68V18.388A16,16,0,1,0,176.934,37.9"
            transform="translate(443.769 454)"
            data-name="Path 5251"
          />
        </g>
      </svg>
    )
  }
}
