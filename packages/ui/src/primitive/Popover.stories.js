import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Div } from 'glamorous'
import React from 'react'
import { ToggleButtons } from '../compound/ToggleButtons'
import { primitive } from '../storyConsts'
import { px } from '../theme'
import { Button } from './Button'
import { Popover, PopoverTitle } from './Popover'

storiesOf(primitive('Popover'), module)
  .addDecorator(s => <Div css={{ padding: px(250) }}>{s()}</Div>)
  .add('Default', () => (
    <Popover trigger={<Button>Hover</Button>} id="sample-text">
      Some sample text
    </Popover>
  ))
  .add('With title', () => (
    <Popover id="with title" trigger={<Button>Hover</Button>}>
      <PopoverTitle>Popover Title</PopoverTitle>
      Some sample text. Some sample text. Some sample text. Some sample text.
      Some sample text.
    </Popover>
  ))
  .add('With link', () => (
    <Popover
      id="with-link"
      trigger={<Button>Click</Button>}
      onEvents={['click']}
    >
      <a>Some sample text</a>
    </Popover>
  ))
  .add('Bottom', () => (
    <Popover
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="bottom"
      id="sample-text"
    >
      Some sample text
    </Popover>
  ))
  .add('Left', () => (
    <Popover
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="left"
      id="sample-text"
    >
      Some sample text
    </Popover>
  ))
  .add('Top', () => (
    <Popover
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="top"
      id="sample-text"
    >
      Some sample text
    </Popover>
  ))
  .add('With button', () => (
    <Popover
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="top"
      id="sample-text"
    >
      Some sample textmnfjklsnSDFJIDHGNKFDLNIALFJSIAJFDKFNK
      <Button alt onClick={action('clicked')}>
        Got it
      </Button>
    </Popover>
  ))
  .add('With 2 buttons', () => (
    <Popover
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="top"
      id="sample-text"
    >
      Some sample text
      <ToggleButtons>
        <Button alt>Yes</Button>
        <Button alt>No</Button>
      </ToggleButtons>
    </Popover>
  ))
