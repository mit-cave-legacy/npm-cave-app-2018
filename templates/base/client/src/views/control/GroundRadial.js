import { IconAdd, SingletonRadialMenu, mapEvent } from 'mit-cave'
import { connect } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { HTMLOverlay } from 'react-map-gl'
import { createSub } from '../../common'
import { getViewport } from '../../features'

class GroundRadialInner extends HTMLOverlay {
  render() {
    const { viewport } = this.context
    const { groundRadial, dispatch } = this.props
    if (!groundRadial) return null
    const { lngLat, isOpen } = groundRadial
    const coords = viewport.project([lngLat.lng, lngLat.lat])
    return (
      <div ref={this._onContainerLoad}>
        <SingletonRadialMenu
          x={coords[0]}
          y={coords[1]}
          getKey={R.always(`${lngLat.lng}/${lngLat.lat}`)}
          isOpen={isOpen}
          onClickaway={() => dispatch(mapEvent.CLOSE_CONTEXT_MENU)}
        >
          <IconAdd />
        </SingletonRadialMenu>
      </div>
    )
  }
}

export const GroundRadial = connect(
  createSub({
    getViewport,
    groundRadial: R.prop('groundRadial')
  })
)(GroundRadialInner)
