import { storiesOf } from '@storybook/react'
import React from 'react'
import { IconAdd } from '../icons/IconAdd'
import { primitive } from '../storyConsts'

import { lightBlue, offRed, offYellow, px } from '../theme'
import { Badge } from './Badge'
import { MapMarker } from './MapMarker'

const badgeVar = (
  <Badge label="472" css={{ border: `${px(2)} solid #105EE7` }} />
)

storiesOf(primitive('Map Marker'), module)
  .add('Default', () => <MapMarker color={lightBlue} />)
  .add('With badge', () => <MapMarker color={offRed} badge={badgeVar} />)
  .add('With IconAdd as badge', () => (
    <MapMarker
      color={offYellow}
      badge={
        <IconAdd size={px(28)} color={'white'} css={{ marginLeft: px(10) }} />
      }
    />
  ))
