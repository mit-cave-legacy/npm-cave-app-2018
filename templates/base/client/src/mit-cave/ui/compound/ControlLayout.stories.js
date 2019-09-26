import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'
import {
  LowerLeft,
  LowerRight,
  SlideFromLeftButton,
  UpperRight
} from './ControlLayout'

storiesOf(compound('ControlLayout'), module)
  .add('Default', () => (
    <div
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <LowerLeft>
        <div
          style={{
            backgroundColor: 'red',
            padding: 20,
            borderRadius: 24
          }}
        >
          Some stuff in lower left
        </div>
      </LowerLeft>
      <LowerRight>
        <div
          style={{
            backgroundColor: 'blue',
            padding: 20,
            borderRadius: 24
          }}
        >
          Some stuff in lower right
        </div>
      </LowerRight>
      <UpperRight>
        <div
          style={{
            backgroundColor: 'green',
            padding: 20,
            borderRadius: 24
          }}
        >
          Some stuff in upper right
        </div>
      </UpperRight>
    </div>
  ))
  .add('DrawerSlides', () => (
    <div
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <LowerLeft>
        <div
          style={{
            backgroundColor: 'red',
            padding: 20,
            borderRadius: 24
          }}
        >
          Some stuff in lower left
        </div>
        <SlideFromLeftButton expanded={true}>
          <div
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: 20,
              borderRadius: 24
            }}
          >
            Some stuff that is slid out from left
          </div>
        </SlideFromLeftButton>
      </LowerLeft>
      <LowerRight>
        <div
          style={{
            backgroundColor: 'blue',
            padding: 20,
            borderRadius: 24
          }}
        >
          Some stuff in lower right
        </div>
      </LowerRight>
    </div>
  ))
