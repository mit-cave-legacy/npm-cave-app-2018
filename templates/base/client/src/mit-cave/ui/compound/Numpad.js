import glam, { Div } from 'glamorous'
import { join, map, pipe, splitEvery } from 'ramda'
import React, { Component } from 'react'
import { css } from 'react-emotion'
import { IconErase } from '../icons/IconErase'
import { Button } from '../primitive/Button'

import { greyBlue, px } from '../theme'
import { AbstractKeyboard } from './Keyboard'

const KEYPAD_WIDTH = 200
const KeypadRoot = glam.div(
  'keypad',
  { propsAreCssOverrides: true },
  {
    position: 'relative',
    fontSize: px(20),
    fontWeight: 100,
    width: px(KEYPAD_WIDTH),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 0
  }
)

const buttonRowStyle = {
  zIndex: 0,
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: px(10)
}

const ButtonRow = glam.div(buttonRowStyle)

const customButtonStyle = {
  zIndex: 0,
  fontSize: px(24),
  fontWeight: 100,
  padding: px(10),
  minWidth: px(48),
  minHeight: px(48),
  border: `${px(1)} solid ${greyBlue}`,
  borderRadius: px(24)
}

const CustomButton = glam(Button)(customButtonStyle)

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '.']

export class Numpad extends Component {
  render() {
    return (
      <AbstractKeyboard {...this.props}>
        {({ createInput, onButtonClick }) => (
          <KeypadRoot>
            <Div css={{ position: 'relative' }}>
              <IconErase
                css={{
                  position: 'absolute', // vertical center
                  zIndex: '1',
                  right: '0',
                  marginRight: '5%',
                  marginTop: 'auto', // vertical center
                  marginBottom: 'auto', // vertical center
                  height: '100%' // vertical center
                }}
                onClick={() => onButtonClick('del')}
                size={px(24)}
              />
              {createInput(
                css({
                  width: px(160)
                })
              )}
            </Div>

            {pipe(
              splitEvery(3),
              map(ks => (
                <ButtonRow key={join('', ks)}>
                  {map(
                    key => (
                      <CustomButton
                        alt
                        key={key}
                        onClick={() => onButtonClick(key)}
                      >
                        {key}
                      </CustomButton>
                    ),
                    ks
                  )}
                </ButtonRow>
              ))
            )(keys)}
          </KeypadRoot>
        )}
      </AbstractKeyboard>
    )
  }
}
