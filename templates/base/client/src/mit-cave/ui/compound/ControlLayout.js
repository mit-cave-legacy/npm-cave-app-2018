import glam from 'glamorous'
import styled from 'react-emotion'
import { px } from '../theme'

/* TODO: Needs work */
export const SlideFromLeftButton = glam.div(
  {},
  ({ expanded, expandedHeight }) => ({
    position: 'absolute',
    transform: 'translate(0,-40px)',
    opacity: expanded ? 1 : 0,
    left: expanded ? 350 : 0,
    height: expanded ? expandedHeight : 40,
    maxHeight: expanded ? expandedHeight : 40,
    transition: 'left 200ms, opacity 200ms, maxHeight 200ms, height 200ms',
    pointerEvents: expanded ? 'inherit' : 'none',
    zIndex: expanded ? 1 : -1
  })
)

export const LowerRight = glam.div({
  position: 'absolute',
  right: 0,
  bottom: px(16),
  zIndex: 100
})

export const LowerLeft = styled('div')({
  position: 'absolute',
  left: 0,
  bottom: px(16),
  zIndex: 100
})

export const BottomRight = LowerRight
export const BottomLeft = LowerLeft

export const BottomCenter = styled('div')({
  position: 'absolute',
  bottom: px(16),
  left: '50%',
  transform: `translate(-50%,0)`,
  zIndex: 100
})

export const Top = glam.div({
  position: 'absolute',
  left: '-50%',
  transform: 'translate(-50%)'
})

export const UpperRight = glam.div({
  position: 'absolute',
  right: 0,
  top: px(16),
  zIndex: 100
})

export const CenteredInPage = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1
})
