import { storiesOf } from '@storybook/react'
import React from 'react'
import { IconCancel } from '../icons/IconCancel'
import { IconConfirm } from '../icons/IconConfirm'
import { primitive } from '../storyConsts'
import { cancel, confirm, greyBlue, lightBlue, px } from '../theme'
// order of imports should be components, icons, theme.js variables
import { Badge } from './Badge'

//try to put as much css as possible in component.js, rather than component.stories.js
storiesOf(primitive('Badge'), module)
  .add('Without Label, green', () => (
    <Badge css={{ backgroundColor: confirm }} />
  ))
  .add('Without Label, red', () => <Badge css={{ backgroundColor: cancel }} />)
  .add('Without Label, blue', () => (
    <Badge css={{ backgroundColor: lightBlue }} />
  ))
  .add('With Label, 1 digit', () => (
    <Badge label="5" css={{ border: '2px solid #1EDD6A' }} />
  ))
  .add('With Label, 2 digits', () => (
    <Badge label="18" css={{ border: '2px solid #E42828' }} />
  ))
  .add('With Label, 3 digits', () => (
    <Badge label="472" css={{ border: '2px solid #105EE7' }} />
  ))
  .add('With Icon, cancel', () => (
    <Badge
      icon={<IconCancel size={px(40)} color={cancel} />}
      css={{
        backgroundColor: greyBlue,
        height: px(64),
        minWidth: px(64),
        borderRadius: '50%'
      }}
    />
  ))
  .add('With Icon, confirm', () => (
    <Badge
      icon={<IconConfirm size={px(40)} color={confirm} />}
      css={{
        backgroundColor: greyBlue,
        height: px(64),
        minWidth: px(64),
        borderRadius: '50%'
      }}
    />
  ))
