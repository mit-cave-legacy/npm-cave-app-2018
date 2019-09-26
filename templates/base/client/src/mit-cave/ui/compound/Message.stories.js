import { storiesOf } from '@storybook/react'

import { Div } from 'glamorous'
import React from 'react'
import { BadgeForMessage } from '../primitive/BadgeForMessage'
import { Button } from '../primitive/Button'
import { compound } from '../storyConsts'
import { cancel, confirm } from '../theme.js'
import { Message } from './Message'

storiesOf(compound('Message'), module)
  .add('Default', () => (
    <Message title="Message title">
      The of failing. Had can live of ocean. In part one evening. Field to a him
      the fame. Covered least he and mental we’ve a on findings. In much from
      endeavours my shall to following were boss’s it much my is subjective may
      in avoid brought because thousand easier consider.
    </Message>
  ))
  .add('With Subtitle', () => (
    <Message title="Message title" subtitle="Subtitle">
      The of failing. Had can live of ocean. In part one evening. Field to a him
      the fame. Covered least he and mental we’ve a on findings. In much from
      endeavours my shall to following were boss’s it much my is subjective may
      in avoid brought because thousand easier consider.
    </Message>
  ))
  .add('With Subtitle & Date', () => (
    <Message title="Message title" subtitle="Subtitle" date="January 1st, 2018">
      He gives his harness bells a shake To ask if there is some mistake. The
      only other sound's the sweep Of easy wind and downy flake. The woods are
      lovely, dark and deep, But I have promises to keep, And miles to go before
      I sleep, And miles to go before I sleep
    </Message>
  ))
  .add('With Button', () => (
    <Message
      title="Message title"
      button1={
        <Button alt css={{ margin: '24px' }}>
          Got it!
        </Button>
      }
    >
      She does not wane, but my fortune, Which her rays do not bless, My wayward
      path declineth soon, But she shines not the less.
    </Message>
  ))
  .add('With Two Buttons', () => (
    <Message
      title="Message title"
      button1={<Button alt>button1</Button>}
      button2={<Button alt>button2</Button>}
    >
      Here while I lie beneath this walnut bough, What care I for the Greeks or
      for Troy town, If juster battles are enacted now Between the ants upon
      this hummock's crown?
    </Message>
  ))
  .add('With status indicators', () => (
    <Message
      title="Message title"
      message="Here while I lie beneath this walnut bough, What care I for the Greeks or for Troy town, If juster battles are enacted now Between the ants upon this hummock's crown?"
      badgeGroup={
        <Div>
          <BadgeForMessage
            css={{
              backgroundColor: confirm,
              boxShadow: '0px 0px 28px 3px rgba(30, 221, 106 ,0.4)',
              marginTop: 12,
              marginBottom: 0,
              marginLeft: 0
            }}
          />
          <BadgeForMessage
            css={{
              backgroundColor: cancel,
              boxShadow: '0px 0px 28px 3px rgba(228, 40, 40 ,0.4)',
              marginTop: 12,
              marginBottom: 0,
              marginLeft: 0
            }}
          />
        </Div>
      }
      date="January 1st, 2018"
    />
  ))
  .add('With all attributes', () => (
    <Message
      title="Message title"
      subtitle="Subtitle"
      message="Here while I lie beneath this walnut bough, What care I for the Greeks or for Troy town, If juster battles are enacted now Between the ants upon this hummock's crown?"
      badgeGroup={
        <Div>
          <BadgeForMessage
            css={{
              backgroundColor: confirm,
              boxShadow: '0px 0px 28px 3px rgba(30, 221, 106 ,0.4)',
              marginTop: 12,
              marginBottom: 0,
              marginLeft: 0
            }}
          />
          <BadgeForMessage
            css={{
              backgroundColor: cancel,
              boxShadow: '0px 0px 28px 3px rgba(228, 40, 40 ,0.4)',
              marginTop: 12,
              marginBottom: 0,
              marginLeft: 0
            }}
          />
        </Div>
      }
      date="January 1st, 2018"
      button1={
        <Button alt css={{ float: 'left' }}>
          button1
        </Button>
      }
      button2={
        <Button alt css={{ float: 'right' }}>
          button2
        </Button>
      }
    />
  ))
