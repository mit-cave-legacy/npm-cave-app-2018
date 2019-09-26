import * as R from 'ramda'
import React from 'react'
import styled, { css, cx } from 'react-emotion'
import {
  borderColor,
  fontSizeSmall,
  fontWeightBold,
  important,
  lightBlue,
  mediumGrey,
  offWhite,
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding,
  standardBoxShadow
} from '../theme'

export const MenuBarButtonRoot = styled('div')({
  display: 'grid',
  color: offWhite,
  minWidth: px(188),
  height: px(46),
  paddingLeft: px(16),
  userSelect: 'none',
  cursor: 'pointer',
  ':active': {
    '*': {
      color: 'white'
    },
    backgroundColor: lightBlue
  }
})

const disabledClass = css({
  '> *': {
    opacity: 0.2
  },
  pointerEvents: 'none'
})

const menuBarWithIconClass = css({
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  gridColumnGap: px(12),
  '&>:nth-child(1)': {
    gridColumn: 1,
    gridRow: '1 / 3',
    alignSelf: 'center'
  },
  '&>:nth-child(2)': {
    gridColumn: 2,
    gridRow: 1
  },
  '&>:nth-child(3)': {
    gridColumn: 2,
    gridRow: 2,
    height: important(px(23))
  }
})

const menuBarWithoutIconClass = css({
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto auto',
  gridColumnGap: px(12),
  '&>:nth-child(1)': {
    gridColumn: 2,
    gridRow: 1
  },
  '&>:nth-child(2)': {
    gridColumn: 2,
    gridRow: 2
  }
})

export const MenuBarButtonTitle = styled('div')({
  fontSize: fontSizeSmall,
  fontWeight: fontWeightBold,
  letterSpacing: 2,
  color: mediumGrey,
  textTransform: 'uppercase',
  alignSelf: 'end'
})

export const MenuBarButtonBodyText = styled('div')({
  fontSize: fontSizeSmall,
  color: offWhite
})

/**
 * MenuBarButton
 * A button designed to be used in a menuBar
 * @param className
 * @param disabled
 * @param title
 * @param children
 * @param icon
 * @param props
 * @returns {*}
 * @constructor
 */
export const MenuBarButton = ({
  className,
  disabled,
  title,
  children,
  icon,
  ...props
}) => (
  <MenuBarButtonRoot
    className={cx(
      'cave-menuBar-button',
      icon ? menuBarWithIconClass : menuBarWithoutIconClass,
      {
        [disabledClass]: disabled
      },
      className
    )}
    {...props}
  >
    {React.cloneElement(icon, {
      size: icon.props.size || 24
    })}
    <MenuBarButtonTitle>{title}</MenuBarButtonTitle>
    {R.is(String, children) ? (
      <MenuBarButtonBodyText>{children}</MenuBarButtonBodyText>
    ) : (
      children
    )}
  </MenuBarButtonRoot>
)

export const MenuBarRoot = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: px(48),
  borderRadius: standardBorderRounding,
  border: standardBorder,
  boxShadow: standardBoxShadow,
  color: offWhite,
  backgroundColor: radiantGraphite,
  overflow: 'hidden'
})

export const MenuBarDivider = styled('div')({
  height: px(32),
  ':first-child': {
    display: 'none'
  },
  borderLeft: `solid ${px(2)} ${borderColor}`
})

/**
 * MenuBar
 * A bar of buttons.
 * @param className
 * @param children
 * @returns {*}
 * @constructor
 */
export const MenuBar = ({ className, children }) => (
  <MenuBarRoot className={className}>
    {React.Children.map(children, child => (
      <React.Fragment>
        <MenuBarDivider />
        {child}
      </React.Fragment>
    ))}
  </MenuBarRoot>
)
