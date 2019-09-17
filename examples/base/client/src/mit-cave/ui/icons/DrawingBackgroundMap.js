import React from 'react'
import map from '../assets/backgroundMap.svg'

export class DrawingBackgroundMap extends React.Component {
  render() {
    const { className } = this.props
    return (
      <div css={className}>
        <img src={map} />
      </div>
    )
  }
}
