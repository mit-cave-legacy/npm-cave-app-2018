import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { IconAdd, IconArrowDown } from '../icons'
import { primitive } from '../storyConsts'
import { px } from '../theme'

import { Button } from './Button'

storiesOf(primitive('Button'), module)
  .add('Default', () => <Button onClick={action('clicked')}>Button</Button>) // onClick={action('clicked')} to log the action
  .add('Default, disabled', () => <Button disabled>Button</Button>)
  .add('Alternate', () => <Button alt>Button</Button>)
  .add('Alternate, disabled', () => (
    <Button alt disabled>
      Button
    </Button>
  ))
  .add('With icon', () => (
    <Button icon={<IconArrowDown size={12} />}>Button</Button>
  ))
  .add('With icon and custom large size', () => (
    <div
      css={{
        display: 'flex',
        alignItems: 'stretch',
        '&>*': {
          height: px(80)
        }
      }}
    >
      <Button icon={<IconAdd size={24} />}>Create a scenario</Button>
    </div>
  ))
