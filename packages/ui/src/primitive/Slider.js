import React from 'react'
import glam from 'glamorous'
import { greyBlue, lightBlue, offWhite, mediumGrey, px } from '../theme'
import sliderThumb from '../assets/sliderThumb.svg'

const SliderRoot = glam.div({
  height: px(24),
  display: 'flex',
  alignItems: 'center',
  color: offWhite
})

const SliderInput = glam.input({
  appearance: 'none',
  width: px(272),
  marginLeft: px(12),
  marginRight: px(12),
  padding: px(0),
  height: px(4) /* Specified height */,
  background: greyBlue /* Grey background */,
  outline: 'none' /* Remove outline */,
  opacity: 1 /* Set transparency (for mouse-over effects on hover) */,
  transition: 'opacity .2s' /* 0.2 seconds transition on hover */,
  '::-webkit-slider-thumb': {
    appearance: 'none',
    width: px(20),
    height: px(24),
    border: 0,
    backgroundColor: lightBlue,
    background: `url(${sliderThumb})`,
    cursor: 'pointer'
  }
})

const OutputDiv = glam.div({
  display: 'flex',
  alignItems: 'center',
  borderRadius: px(8),
  color: offWhite,
  backgroundColor: mediumGrey,
  width: px(60),
  height: px(36),
  marginBottom: px(5)
})

/**
 * Slider
 * @param children
 * @param minProp
 * @param maxProp
 * @returns {*}
 * @constructor
 */
export const Slider = ({ children, minProp, maxProp }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: px(50)
      }}
    >
      <OutputDiv>
        <p id="output" style={{ width: '100%', textAlign: 'center' }}>
          {(minProp + maxProp) / 2}
        </p>
      </OutputDiv>
      <SliderRoot>
        <div style={{ paddingTop: px(3) }}>{minProp}</div>
        <SliderInput
          id="slider-el"
          type="range"
          min={minProp}
          max={maxProp}
          onChange={e => {
            var outputVar = document.getElementById('output')
            outputVar.innerHTML = e.target.value
          }}
        />
        <div style={{ paddingTop: px(3) }}>{maxProp}</div>
      </SliderRoot>
    </div>
  )
}
