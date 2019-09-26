import React from 'react'
import styled from 'react-emotion'
import {
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding
} from '../theme'

/**
 * Header
 * Used at top of a page.
 * @type {StyledOtherComponent<object, JSX.IntrinsicElements[[string]], Theme>}
 */
export const Header = styled('div')(_ => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  height: px(56),
  border: standardBorder,
  borderBottomRightRadius: standardBorderRounding,
  borderBottomLeftRadius: standardBorderRounding,
  alignItems: 'center',
  gridColumnGap: px(20),
  paddingLeft: px(32),
  paddingRight: px(32),
  backgroundColor: radiantGraphite,
  boxShadow: `0 8px 16px rgba(0,0,0,.36)`
}))

/**
 * Floeating Header
 * @type {StyledStatelessComponent<object, object, Theme>}
 */
export const FloatingHeader = styled(Header)(_ => ({
  position: 'absolute',
  top: 0,
  left: '50vw',
  width: '80vw',
  translate: '-50%',
  zIndex: 1
}))
