import React from 'react'
import { css, cx } from 'react-emotion'
import { VizMainTitle } from '../compound'
import { offWhite, px, standardBorder } from '../theme'

/**
 * @name ChartDiff
 * @param title
 * @param children
 * @returns {*}
 */
export const ChartDiff = ({ title = 'No Scenario Selected', children }) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      color: offWhite,
      paddingLeft: px(24),
      paddingRight: px(24),
      paddingBottom: px(24),
      paddingTop: px(20),
      '&>:nth-child(2)': {
        flex: 1,
        marginTop: px(12),
        marginBottom: px(24)
      },
      '&>:not(:first-child)': {
        flex: 1
      }
    }}
  >
    <VizMainTitle>{title}</VizMainTitle>
    {children}
  </div>
)

/**
 * @name DiffSideBySideLayout
 * @param className
 * @param children
 * @returns {*}
 */
export const DiffSideBySideLayout = ({ className, children }) => (
  <div
    className={cx(
      css({
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gridColumnGap: px(12)
      }),
      className
    )}
  >
    {children[0]}
    <div css={{ borderLeft: standardBorder }} />
    {children[1]}
  </div>
)
