import React from 'react'
import styled from 'react-emotion'
import { CaveLogo } from '../icons'
import { fontSizeLarge, fontWeightSemiBold, offWhite, px } from '../theme'

/* A plain header for use on non-navigation pages (such as the session manager) */
export const PlainCaveHeader = ({ className }) => (
  <div
    className={className}
    css={{
      display: 'flex',
      alignItems: 'center',
      height: px(32)
    }}
  >
    <CaveLogo />
    <div
      css={{
        paddingLeft: 14,
        fontSize: fontSizeLarge,
        fontWeight: fontWeightSemiBold,
        color: offWhite
      }}
    >
      <div>MIT Center for</div>
      <div>Transportation & Logistics</div>
    </div>
  </div>
)

export const FloatingPlainCaveHeader = styled(PlainCaveHeader)({
  position: 'absolute',
  top: px(24),
  left: px(32)
})
