import React from 'react'
import { css, cx } from 'react-emotion'
import { greyBlue, lightGrey, offWhite, px } from '../theme'
import { Autosized } from './Autosized'

const reactVisCaveStyles = {
  // backgroundColor: radiantGraphite,
  /* grid lines */
  '& line.rv-xy-plot__grid-lines__line': {
    stroke: greyBlue,
    strokeWidth: px(1)
  },
  /* axis lines */
  '& line.rv-xy-plot__axis__line': {
    stroke: lightGrey,
    strokeWidth: px(1)
  },
  /* ticks */
  '& line.rv-xy-plot__axis__tick__line': {
    stroke: lightGrey,
    strokeWidth: px(1)
  },
  /* tick text */
  '& text.rv-xy-plot__axis__tick__text': {
    stroke: 'none',
    fill: offWhite,
    fontSize: px(13)
  },
  /* title text */
  '& g.rv-xy-plot__axis__title text': {
    fill: offWhite
  },
  /* series text */
  '& text.rv-xy-plot__series--label-text': {
    fill: offWhite
  },
  '& .rv-xy-plot__series--line': {
    fill: 'none'
  }
}

/**
 * Styles a React-vis chart correctly
 * @param className
 * @param children
 * @returns {*}
 * @constructor
 */
export const CaveChart = ({ className, children }) => (
  <div
    className={cx(
      className,
      css({
        ...reactVisCaveStyles,
        '&>:first-child': {
          width: '100%',
          height: '100%'
        }
      })
    )}
  >
    {children}
  </div>
)

/**
 * Convenience wrapper that combines autosizing with cave chart
 * @param css
 * @param children
 * @param rest
 * @returns {*}
 * @constructor
 */
export const AutosizedCaveChart = ({ css, children, ...rest }) => (
  <Autosized
    css={{
      ...reactVisCaveStyles,
      ...css
    }}
    {...rest}
  >
    {children}
  </Autosized>
)
