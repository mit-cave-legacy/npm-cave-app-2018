import React from 'react'
import styled, { css, cx } from 'react-emotion'
import { withProps } from 'recompose'
import {
  greyBlue,
  mediumGrey,
  offWhite,
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding,
  standardBoxShadow
} from '../theme'

export const VizMainTitle = styled('div')({
  fontSize: px(20),
  fontWeight: 'bold',
  color: offWhite,
  display: 'inline'
})

export const VizSubTitle = styled('div')({
  fontSize: px(13),
  fontWeight: 'bold',
  color: mediumGrey,
  textTransform: 'uppercase',
  display: 'inline'
})
export const VizTitleSeparator = () => (
  <span
    css={{
      paddingLeft: px(4),
      paddingRight: px(16),
      color: greyBlue
    }}
  >
    |
  </span>
)

/**
 * Title line for a viz, containing title, subtitle, and expander
 */
const VizHeaderRoot = withProps({ className: 'cave-viz-header' })(
  styled('div')({
    height: px(60),
    paddingLeft: px(24),
    paddingRight: px(24),
    display: 'flex',
    alignItems: 'center',
    label: 'cave-viz-header'
  })
)

/**
 * Title line for a viz, containing title, subtitle, and expander
 * @param title
 * @param subtitle
 * @param children
 * @returns {*}
 * @constructor
 */
export const VizHeader = ({ title, subtitle, children }) => (
  <VizHeaderRoot>
    <VizMainTitle>{title}</VizMainTitle>
    {subtitle && <VizTitleSeparator />}
    <VizSubTitle css={{ marginTop: 2, flex: 1 }}>{subtitle}</VizSubTitle>
    <div css={{ flex: 1 }} />
    {children}
  </VizHeaderRoot>
)
export const TitledVizHeader = VizHeader

const vizContainerChildLayoutCss = {
  label: 'viz',
  display: 'grid',
  alignItems: 'stretch',
  gridTemplateRows: 'auto 1fr',
  '.cave-chart': {
    marginTop: 16,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 32
  },
  overflow: 'hidden'
}

const vizSelfStyleCss = {
  label: 'raised-box',
  backgroundColor: radiantGraphite,
  border: standardBorder,
  borderRadius: standardBorderRounding,
  boxShadow: standardBoxShadow,
  /* child text */
  color: offWhite,
  overflow: 'hidden',
  height: '100%'
  /* Right now we have no context for "popping out" a visualization */
  // '&>*>.cave-viz-header .cave-icon-expand': {
  //   display: 'inherit',
  // }
}

/**
 * A viz box has the visual styling for a viz.
 * It gives a 100% width/height on it's single child
 * and tells its header to not display
 */
export const RaisedBox = styled('div')(vizSelfStyleCss)

export const VizRoot = styled('div')(vizContainerChildLayoutCss)
/*
 *
 */
/**
 * @name Viz
 * @desc  Container for visualizations (charts and tables)
 * Consists of just the surrounding box
 * expects two child rows - first is header, second is body
 * There is no padding. The header has its own padding.
 * It does apply padding automatically to any .cave-chart
 * A viz is flat and has no border - put it in a RaisedBox for that
 * @param className
 * @param title
 * @param subtitle
 * @param children
 * @returns {*}
 * @constructor
 */
export const Viz = ({ className, title, subtitle, children }) => (
  <VizRoot className={className}>
    {(title || subtitle) && (
      <TitledVizHeader title={title} subtitle={subtitle} />
    )}
    {children}
  </VizRoot>
)

export const TitledViz = Viz

const multivizChildrenClass = css({
  display: 'grid',
  gridTemplateAreas: `
    "table-or-chart vert-line legend"
    "horiz-line horiz-line horiz-line"
    "table table table"`,
  gridTemplateColumns: '1fr auto auto',
  gridTemplateRows: '1fr auto auto auto auto auto',
  '&>:nth-child(1)': {
    gridArea: 'table-or-chart'
  },
  '&>:nth-child(3)': {
    gridArea: 'legend'
  },
  '&>:nth-child(5)': {
    gridArea: 'table'
  },
  label: 'cave-multi-vis-layout'
})

/**
 * @name MultiViz
 * @desc A container that expects two items in a side-by-side layout.
 * This is for the fancy case when you want the legend (for example) on the side
 * The first child is on the left and takes up any left-over container space
 *
 * NOTE: There is a bug in emotion where it does not allow multi-line css values, meaning
 * you cannot use gridTemplateAreas with it. Boo!!
 * @param className
 * @param children
 * @returns {*}
 * @constructor
 */
export const MultiViz = ({ className, children }) => (
  <div className={cx(className, multivizChildrenClass)}>
    {React.Children.count(children) === 1 ? children : children[0]}
    {children[1] && (
      <div
        css={{
          gridArea: 'vert-line',
          marginTop: 24,
          marginBottom: 24,
          borderLeft: standardBorder
        }}
      />
    )}
    {children[1]}
    {children[2] && (
      <div
        css={{
          gridArea: 'horiz-line',
          marginLeft: 24,
          marginRight: 24,
          borderBottom: standardBorder
        }}
      />
    )}
    {children[2]}
  </div>
)
