import React from 'react'
import styled from 'react-emotion'
import { px } from '../theme.js'

export const svgIconClassname = 'svg-icon'

const SvgIconBase = styled('svg')(
  {
    stroke: 'none',
    /* TODO: fix radial which depends on actual svg-icon class */
    label: 'svg-icon'
  },
  ({ size = px(24) }) => ({
    width: size,
    height: size,
    padding: px(0)
  }),
  ({ color }) => color && { fill: color },
  ({ disabled }) => ({
    pointerEvents: disabled ? 'none' : 'inherit',
    opacity: disabled ? 0.5 : 1
  })
)

SvgIconBase.className = svgIconClassname

export const SvgIcon = ({ viewBox = '0 0 24 24', ...props }) => (
  <SvgIconBase viewBox={viewBox} {...props} />
)
