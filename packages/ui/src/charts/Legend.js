import React from 'react'
import { css, cx } from 'react-emotion'
import { fontSizeSmall, fontWeightBold, offWhite, px } from '../theme'

const verticalLegendClass = css({
  width: px(239),
  paddingTop: 26,
  paddingLeft: 37,
  color: offWhite
})

/**
 * @name VerticalLegend
 * @param className
 * @param children
 * @returns {*}
 */
export const VerticalLegend = ({ className, children }) => (
  <div className={cx(className, verticalLegendClass)}>
    <div
      css={{
        fontWeight: fontWeightBold,
        letterSpacing: px(1)
      }}
    >
      LEGEND
    </div>
    <div
      css={{
        paddingTop: 11 // 17-6,
      }}
    />
    {children}
  </div>
)

const legendKeyClass = css({
  display: 'flex',
  height: px(22),
  alignItems: 'center'
})

/**
 * @name LegendKey
 * @param className
 * @param title
 * @param color
 * @returns {*}
 * @constructor
 */
export const LegendKey = ({ className, title, color }) => (
  <div style={{}} className={cx(className, legendKeyClass)}>
    <div
      css={{
        width: px(16),
        height: px(16),
        backgroundColor: color,
        borderRadius: px(4)
      }}
    />
    <div
      css={{
        marginLeft: px(12),
        fontSize: fontSizeSmall,
        color: offWhite
      }}
    >
      {title}
    </div>
  </div>
)
