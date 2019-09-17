import * as R from 'ramda'
import React from 'react'
import styled, { css, cx } from 'react-emotion'
import { lightBlue, px, radiantGraphite, standardBorder } from '../theme'

const progressBarClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  minWidth: px(114),
  maxWidth: px(114),
  paddingTop: px(1),
  paddingBottom: px(1)
})

const ProgressTick = styled('div')(
  {
    borderRadius: '100%',
    width: px(6),
    height: px(12)
  },
  ({ active }) => ({
    backgroundColor: active ? lightBlue : 'none',
    border: active ? 'none' : standardBorder
  })
)

/**
 * TickProgressBar
 * @param className
 * @param percent
 * @returns {*}
 * @constructor
 */
export const TickProgressBar = ({ className, percent }) => (
  <div className={cx(progressBarClass, className)}>
    {R.range(1, 11).map(i => (
      <ProgressTick active={percent / 10 >= i} />
    ))}
  </div>
)

/**
 * ProgressBar
 * @param className
 * @param percent
 * @returns {*}
 * @constructor
 */
export const ProgressBar = ({ className, percent }) => (
  <div
    css={{
      border: standardBorder,
      borderRadius: px(12),
      width: px(232),
      backgroundColor: radiantGraphite
    }}
  >
    <div
      style={{
        width: `${percent}%`
      }}
      css={{
        height: px(12),
        borderRadius: px(12),
        backgroundColor: lightBlue,
        transition: 'width .1s'
      }}
    />
  </div>
)
