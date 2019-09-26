import React, { Fragment, cloneElement } from 'react'
import glam from 'glamorous'
import ReactTooltip from 'react-tooltip'
import * as PropTypes from 'prop-types'

import { greyBlue, radiantGraphite, brightBlue, offWhite, px } from '../theme'

const { string, node, any, arrayOf, oneOf } = PropTypes

const PopoverBox = glam.div(
  {
    fontSize: px(13),
    fontWeight: 'regular',
    borderRadius: px(8),
    padding: px(16),
    display: 'inline-block',
    position: 'relative',
    color: `${brightBlue}`,
    backgroundColor: radiantGraphite,
    border: `${px(1)} solid ${greyBlue}`,
    boxShadow: `${px(10)} ${px(13)} ${px(16)} ${px(0)} rgba(0,0,0,0.36)`,
    '&::after, &::before': {
      border: 'solid transparent',
      content: ' ',
      height: 0,
      width: 0,
      position: 'absolute'
    },
    '& a': {
      color: brightBlue
    },
    '& .cave-button': {
      height: px(36),
      width: px(120),
      fontSize: px(15),
      borderRadius: `${px(8)} !important`,
      padding: `${px(0)} ${px(10)}`,
      marginTop: px(16),
      display: 'block',
      marginLeft: 'auto',
      '&:not(:first-child)': {
        marginLeft: px(10)
      }
    }
  },
  ({ place }) =>
    place === ('right' || null) && {
      '&::after': {
        right: '100%',
        top: '50%',
        borderRightColor: radiantGraphite,
        borderWidth: px(6),
        marginTop: px(-6)
      },
      '&::before': {
        right: '100%',
        top: '50%',
        borderRightColor: greyBlue,
        borderWidth: px(7),
        marginTop: px(-7)
      }
    },
  ({ place }) =>
    place === 'left' && {
      '&::after': {
        left: '100%',
        top: '50%',
        borderLeftColor: radiantGraphite,
        borderWidth: px(6),
        marginTop: px(-6)
      },
      '&::before': {
        left: '100%',
        top: '50%',
        borderLeftColor: greyBlue,
        borderWidth: px(7),
        marginTop: px(-7)
      }
    },
  ({ place }) =>
    place === 'bottom' && {
      '&::after': {
        left: '50%',
        bottom: '100%',
        borderBottomColor: radiantGraphite,
        borderWidth: px(6),
        marginLeft: px(-6)
      },
      '&::before': {
        left: '50%',
        bottom: '100%',
        borderBottomColor: greyBlue,
        borderWidth: px(7),
        marginLeft: px(-7)
      }
    },
  ({ place }) =>
    place === 'top' && {
      '&::after': {
        left: '50%',
        top: '100%',
        borderTopColor: radiantGraphite,
        borderWidth: px(6),
        marginLeft: px(-6)
      },
      '&::before': {
        left: '50%',
        top: '100%',
        borderTopColor: greyBlue,
        borderWidth: px(7),
        marginLeft: px(-7)
      }
    }
)

const StyledTooltip = glam(ReactTooltip)({
  pointerEvents: 'all'
})

export const PopoverTitle = glam.div({
  color: `${offWhite}`,
  fontWeight: 'normal',
  fontSize: px(15),
  marginBottom: px(12)
})

/**
 * Popover
 * @param children
 * @param trigger
 * @param id
 * @param place
 * @param onEvents
 * @param offEvents
 * @param props
 * @returns {*}
 * @constructor
 */
const Popover = ({
  children,
  trigger,
  id,
  place = 'right',
  onEvents = [],
  offEvents = [],
  ...props
}) => (
  <Fragment>
    {cloneElement(trigger, {
      'data-for': id,
      'data-tip': true,
      'data-event': onEvents.join(' '),
      'data-event-off': offEvents.join(' ')
    })}
    <StyledTooltip effect="solid" type="null" {...{ id, place }}>
      <PopoverBox {...props} place={place}>
        {children}
      </PopoverBox>
    </StyledTooltip>
  </Fragment>
)

Popover.propTypes = {
  children: any.isRequired,
  trigger: node.isRequired,
  id: string.isRequired,
  place: oneOf(['top', 'bottom', 'left', 'right']),
  onEvents: arrayOf(oneOf(['click', 'focus', 'hover', 'dblclick'])),
  offEvents: arrayOf(oneOf(['click', 'focus', 'hover', 'dblclick']))
}

export { Popover }

export default Popover
