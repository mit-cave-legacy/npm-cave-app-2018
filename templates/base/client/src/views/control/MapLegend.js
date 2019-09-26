import { Form, Pad } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { createSub } from '../../common'
import {
  getLayerVisibility,
  getPad,
  withWiredPadProps
} from '../../features'

const PAD_ID = 'mapLegend'

export const MapLegend = component(
  'MapControls',
  createSub({
    getLayerVisibility,
    pad: getPad(PAD_ID)
  }),
  ({ pad }) => {

    return (
      <Pad
        size="small"
        {...withWiredPadProps({ pad, padId: PAD_ID, defaultX: 0 })}
        title="Map Legend"
      >
        <Form>
          {'None'}
        </Form>
      </Pad>
    )
  }
)
