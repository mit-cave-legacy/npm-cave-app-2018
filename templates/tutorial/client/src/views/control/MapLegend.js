import { Form, Pad } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { createSub } from '../../common'
import {
  getLayerVisibility,
  getPad,
  withWiredPadProps
} from '../../features'
import { mapEvent,Toggle } from 'mit-cave'
import { dispatch } from '../../store'

const PAD_ID = 'mapLegend'

export const MapLegend = component(
  'MapControls',
  createSub({
    getLayerVisibility,
    pad: getPad(PAD_ID)
  }),
  ({ pad, layerVisibility }) => {

    return (
      <Pad
        size="small"
        {...withWiredPadProps({ pad, padId: PAD_ID, defaultX: 0 })}
        title="Map Legend"
      >
        <Form>
          <Toggle
            label={"Stores"}
            value={layerVisibility["stores"]}
            onChange={value => dispatch(mapEvent.CHANGE_LAYER_VISIBILITY, ["stores", value])}
          />
          <Toggle
            label={"MIT CTL"}
            value={layerVisibility["ctl"]}
            onChange={value => dispatch(mapEvent.CHANGE_LAYER_VISIBILITY, ["ctl", value])}
          />
        </Form>
      </Pad>
    )
  }
)
