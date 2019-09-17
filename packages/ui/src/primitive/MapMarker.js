import React from 'react'
import { IconMapMarker } from '../icons/IconMapMarker'
import glam, { Div } from 'glamorous'
import { px } from '../theme.js'

const MapMarkerContainer = glam.div(
  'MapMarkerContainer',
  { propsAreCssOverrides: true },
  {
    position: 'relative',
    height: px(76),
    '& .map-marker': {
      position: 'absolute',
      bottom: px(0),
      zIndex: '-1'
    },
    '& Div': {
      //wrap potential badge
      marginLeft: px(13)
    }
  }
)

/**
 * MapMarker
 * @param id
 * @param color
 * @param size
 * @param badge
 * @param props
 * @returns {*}
 * @constructor
 */
export const MapMarker = ({ id, color, size, badge, ...props }) => (
  <MapMarkerContainer {...props}>
    <IconMapMarker
      id={id}
      className="map-marker"
      color={color}
      size={size || px(68)}
    />
    {badge && <Div>{badge}</Div>}
  </MapMarkerContainer>
)
