import React from 'react'
import { css } from 'react-emotion'
import { px, radiantGraphite, standardBorder } from '../theme'

const pitchClass = css`
  border: none;
  margin: 0;
  padding: 0;
  width: ${px(180)};
  height: ${px(24)};
  background: transparent;
  font: 1em/1 arial, sans-serif;
  -webkit-appearance: none;
  //border: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  &::-webkit-slider-runnable-track {
    box-sizing: border-box;
    border: none;
    width: ${px(11.25 * 16)};
    height: ${px(0.125 * 16)};
    background: #39404c;
  }
  &::-webkit-slider-thumb {
    margin-top: -0.7em;
    box-sizing: border-box;
    border: none;
    width: ${px(1.25 * 16)};
    height: ${px(1.5 * 16)};
    border-radius: 6px;
    background: #105ee7;
    background: repeating-linear-gradient(
          90deg,
          #609aff,
          #609aff 0.1em,
          transparent 0.1em,
          transparent 0.25em
        )
        no-repeat 50% 50%,
      linear-gradient(#105ee7, #105ee7);
    background-size: 50% 0.75em, 100% 100%;
  }
  &::-ms-tooltip {
    display: none;
  }
  &:focus {
    outline: none;
  }
`

const PADDING_V = 10
const PADDING_H = 12
export const PitchSlider = ({ value, onChange = () => {}, min, max }) => (
  <div
    css={{
      border: standardBorder,
      borderRadius: px(50),
      width: px(24 + PADDING_H * 2),
      height: px(180 + PADDING_V * 2),
      background: radiantGraphite,
      padding: `${px(PADDING_V)} ${px(PADDING_H)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div
      css={{
        transform: 'rotate(-90deg)',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <input
        css={pitchClass}
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </div>
)
