import React from 'react'
import styled, { css, cx } from 'react-emotion'
import {
  greyBlue,
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding,
  standardBoxShadow
} from './theme'

const QuadCross = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 2 2"
    preserveAspectRatio="none"
    css={{
      line: {
        vectorEffect: 'non-scaling-stroke'
      },
      stroke: greyBlue,
      strokeWidth: px(1),
      pointerEvents: 'none'
    }}
  >
    <line x1={0} y1={1} x2={2} y2={1} />
    <line x1={1} y1={0} x2={1} y2={2} />
  </svg>
)

const dashboardQuadLayoutClass = css({
  display: 'grid',
  position: 'relative',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  paddingLeft: px(24),
  paddingRight: px(24),
  paddingBottom: px(24),
  paddingTop: px(20),
  gridColumnGap: px(24),
  gridRowGap: px(24),
  /* Disable borders on children */
  '>*': {
    border: '1px solid transparent'
  }
})

export const DashboardQuadLayout = ({ className, children }) => (
  <div className={cx(dashboardQuadLayoutClass, className)}>
    {children}
    <QuadCross
      css={{
        position: 'absolute',
        width: '100%',
        height: '100%'
      }}
    />
  </div>
)

export const FullScreenContainer = styled('div')(
  _ => ({
    position: 'absolute',

    left: px(48),
    width: `calc(100vw - ${px(96)})`,

    /* Hack to deal with chrome layout bugs */
    display: 'flex',
    '&>*': {
      flexGrow: 1
    },
    border: standardBorder,
    borderRadius: standardBorderRounding,
    backgroundColor: radiantGraphite,
    boxShadow: standardBoxShadow
  }),
  ({ topNav }) =>
    !topNav
      ? {
          top: px(48),
          height: `calc(100vh - ${px(128)})`
        }
      : {
          top: px(80),
          height: `calc(100vh - ${px(160)})`
        }
)

export const HeadlessFullScreen = styled('div')({
  position: 'absolute',
  top: px(80),
  left: px(48),
  width: `calc(100vw - ${px(96)})`,
  height: `calc(100vh - ${px(128)})`,
  /* Hack to deal with chrome layout bugs */
  display: 'flex',
  '&>*': {
    flexGrow: 1
  }
})

export const DashboardSideBySideLayout = styled('div')(_ => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  paddingLeft: px(24),
  paddingRight: px(24),
  paddingBottom: px(24),
  paddingTop: px(20),
  gridColumnGap: px(24),
  gridRowGap: px(24)
}))

/**
 * Combo of full-screen & quad layout
 * @deprecated
 * @param topNav allocate space for top navigation
 * @param children
 * @returns {*}
 * @constructor
 */
export const FullScreenQuadLayout = ({ topNav, children }) => (
  <FullScreenContainer topNav={topNav}>
    <DashboardQuadLayout>{children}</DashboardQuadLayout>
  </FullScreenContainer>
)
