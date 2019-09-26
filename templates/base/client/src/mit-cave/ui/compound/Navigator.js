import * as R from 'ramda'
import React from 'react'
import styled, { css, cx } from 'react-emotion'
import {
  fontSizeLarge,
  fontWeightBold,
  mediumGrey,
  offWhite,
  px
} from '../theme'

export const NavigationTab = styled('div')(({ active }) => ({
  fontSize: fontSizeLarge,
  cursor: 'pointer',
  color: active ? offWhite : mediumGrey,
  fontWeight: fontWeightBold,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',

  '.cave-vertical-tabs > &': {
    marginTop: px(24),
    paddingLeft: px(29),
    paddingRight: px(29)
  },
  '.cave-vertical-tabs > &:last-child': {
    marginBottom: px(24)
  }
}))

const horizClass = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  '&>:not(:last-child)': {
    marginRight: px(20)
  }
})

const vertClass = css({
  display: 'flex',
  flexDirection: 'column',
  minWidth: px(200)
})

/**
 * TabSelector
 * @param className
 * @param vertical
 * @param value
 * @param onSelect
 * @param children
 * @returns {*}
 * @constructor
 */
export const TabSelector = ({
  className,
  vertical,
  value,
  onSelect = () => {},
  children
}) => (
  <div
    className={cx(
      {
        [horizClass]: !vertical,
        [vertClass]: vertical,
        'cave-vertical-tabs': vertical
      },
      className
    )}
  >
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        active: R.equals(child.props.value, value),
        onClick: () => onSelect(child.props.value)
      })
    )}
  </div>
)
TabSelector.propTypes = {}
