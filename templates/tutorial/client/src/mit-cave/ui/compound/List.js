import React from 'react'
import styled, { css, cx } from 'react-emotion'
import { IconChevRight } from '../icons'
import { RadioDot } from '../primitive'
import {
  darkGrey,
  fontSizeMedium,
  fontSizeSmall,
  fontWeightSemiBold,
  important,
  lightBlue,
  px,
  standardBorder,
  standardBorderRounding
} from '../theme'

const radioListItemClass = css({
  height: px(87),
  display: 'flex',
  userSelect: 'none',
  border: standardBorder,
  ':first-child': {
    borderTopLeftRadius: standardBorderRounding,
    borderTopRightRadius: standardBorderRounding
  },
  ':active': {
    backgroundColor: darkGrey,
    border: `${px(1)}  solid ${lightBlue}`,
    zIndex: 1
  }
})

const radioListItemSelectedClass = css({
  backgroundColor: darkGrey,
  border: `${px(1)}  solid ${lightBlue}`,
  zIndex: 1
})

export const ListItemBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: 'space-between',
  paddingTop: px(16),
  paddingBottom: px(12),
  flex: 1
})

export const ListItemTitle = styled('div')({
  fontSize: fontSizeMedium,
  fontWeight: fontWeightSemiBold,
  paddingBottom: px(8)
})

/**
 * RadioListItem
 * @param className
 * @param title
 * @param isChecked
 * @param children
 * @param onSelect
 * @param nav
 * @param onNav
 * @returns {*}
 * @constructor
 */
export const RadioListItem = ({
  className,
  title,
  isChecked,
  children,
  onSelect,
  nav,
  onNav
}) => (
  <div
    className={cx(
      radioListItemClass,
      {
        [radioListItemSelectedClass]: isChecked
      },
      className
    )}
  >
    <div
      onClick={onSelect}
      css={{
        width: px(44),
        paddingLeft: px(16),
        paddingTop: px(17),
        cursor: 'pointer'
      }}
    >
      <RadioDot isChecked={isChecked} />
    </div>
    <ListItemBody>
      <ListItemTitle>{title}</ListItemTitle>
      <div css={{ fontSize: fontSizeSmall }}>{children}</div>
    </ListItemBody>
    {nav && (
      <div
        onClick={onNav}
        css={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: px(12),
          paddingLeft: px(6),
          cursor: 'pointer'
        }}
      >
        <IconChevRight size={16} />
      </div>
    )}
  </div>
)

export const listClass = css({
  label: 'cave-list',
  overflowX: 'hidden',
  overflowY: 'auto',
  '::-webkit-scrollbar': { width: important(0) }
})

/**
 * List
 * @param ref
 * @param className
 * @param children
 * @returns {*}
 * @constructor
 */
export const List = ({ ref, className, children }) => (
  <div ref={ref} className={cx(listClass, className)}>
    {children}
  </div>
)
