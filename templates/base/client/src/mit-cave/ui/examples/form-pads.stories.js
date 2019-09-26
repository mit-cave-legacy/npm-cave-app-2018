import { storiesOf } from '@storybook/react'
import { css } from 'emotion'
import React from 'react'
import { BigForm, FormSeparator, Pad, ToggleButtons } from '../compound'
import { IconCancel } from '../icons'
import { Button, Toggle } from '../primitive'
import { kitchenSink } from '../storyConsts'
import { px } from '../theme'

storiesOf(kitchenSink('Pads & Forms'), module).add('In a pad', () => (
  <Pad
    x={100}
    y={100}
    className={css({
      width: px(248)
    })}
    selfMove={true}
    iconRight={<IconCancel />}
    title="Map Options"
  >
    <BigForm>
      <ToggleButtons label="Map Dimensionality" value="2D">
        <Button value={'2D'}>2D</Button>
        <Button value={'3D'}>3D</Button>
      </ToggleButtons>
      <FormSeparator />
      <Toggle label="Regions" />
      <Toggle label="Arcs" />
      <Toggle label="Nodes" />
      <Toggle label="Facilities" />
    </BigForm>
  </Pad>
))
