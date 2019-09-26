import { storiesOf } from '@storybook/react'
import { Div } from 'glamorous'
import {
  forEachObjIndexed,
  map,
  mapObjIndexed,
  merge,
  reduce,
  values
} from 'ramda'
import React from 'react'

import { offWhite, px, standardBorder } from '../theme'

const req = require.context('.', true, /[^SvgWrapper].js$/)

const stories = reduce(
  (acc, key) => merge(acc, mapObjIndexed(x => x, req(key))),
  {},
  req.keys()
)

const s = storiesOf('ICONS', module).add('All', () => (
  <Div
    css={{
      display: 'flex',
      flexWrap: 'wrap',
      color: offWhite
    }}
  >
    {map(
      Icon => (
        <Div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            '&>:first-child': {
              marginBottom: px(4)
            },
            border: standardBorder
          }}
        >
          <Icon />
          {Icon.displayName || Icon.name}
        </Div>
      ),
      values(stories)
    )}
  </Div>
))

forEachObjIndexed((Icon, id) => s.add(id, () => <Icon />), stories)
