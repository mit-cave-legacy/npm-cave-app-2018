import { storiesOf } from '@storybook/react'
import { Div } from 'glamorous'
import React from 'react'
import { primitive } from '../storyConsts'
import { px } from '../theme'
import { Button } from './Button'
import { Tooltip, TooltipTitle } from './Tooltip'

storiesOf(primitive('Tooltip'), module)
  .addDecorator(s => <Div css={{ padding: px(250) }}>{s()}</Div>)
  .add('Default', () => (
    <Tooltip trigger={<Button>Hover</Button>} id="sample-text">
      Some sample text
    </Tooltip>
  ))
  .add('Trigger on click', () => (
    <Tooltip
      onEvents={['click']}
      trigger={<Button>Click</Button>}
      id="sample-text"
    >
      Some sample text
    </Tooltip>
  ))
  .add('Bottom', () => (
    <Tooltip
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="bottom"
      id="sample-text"
    >
      Some sample text
    </Tooltip>
  ))
  .add('Left', () => (
    <Tooltip
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="left"
      id="sample-text"
    >
      Some sample text
    </Tooltip>
  ))
  .add('Top', () => (
    <Tooltip
      trigger={<Button>Click</Button>}
      onEvents={['click']}
      place="top"
      id="sample-text"
    >
      Some sample text
    </Tooltip>
  ))
  .add('Long text with wrap', () => (
    <Tooltip
      trigger={<Button>Hover</Button>}
      css={{ maxWidth: 250 }}
      id="max-width"
    >
      Some sample text that's very very very very very very very very very very
      long.
    </Tooltip>
  ))
  .add('With title', () => (
    <Tooltip id="with title" trigger={<Button>Hover</Button>}>
      <TooltipTitle>Tooltip Title</TooltipTitle>
      Some sample text. Some sample text. Some sample text. Some sample text.
      Some sample text.
    </Tooltip>
  ))
