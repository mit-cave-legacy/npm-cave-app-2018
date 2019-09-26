import React, { Fragment, cloneElement } from 'react'
import glam from 'glamorous'
import ReactTooltip from 'react-tooltip'
import * as PropTypes from 'prop-types'

import { greyBlue, offWhite, px } from '../theme'

const { string, node, any, arrayOf, oneOf } = PropTypes
const TooltipRoot = glam.div(
  {
    fontSize: px(13),
    fontWeight: '100',
    borderRadius: px(8),
    maxWidth: px(300),
    padding: px(10),
    display: 'inline-block',
    position: 'relative',
    color: offWhite,
    backgroundColor: greyBlue,
    boxShadow: `${px(10)} ${px(13)} ${px(16)} ${px(0)} rgba(0,0,0,0.36)`,
    '&::after': {
      //little arrow
      border: 'solid transparent',
      content: ' ',
      height: px(0),
      width: px(0),
      position: 'absolute',
      borderColor: 'transparent',
      borderWidth: px(6)
    }
  },
  (
    { place } //little arrows on tooltip
  ) =>
    place === 'right' && {
      '&::after': {
        right: '100%',
        top: '50%',
        borderRightColor: greyBlue,
        marginTop: px(-6)
      }
    },
  ({ place }) =>
    place === 'left' && {
      '&::after': {
        left: '100%',
        top: '50%',
        borderLeftColor: greyBlue,
        marginTop: px(-6)
      }
    },
  ({ place }) =>
    place === 'bottom' && {
      '&::after': {
        left: '50%',
        bottom: '100%',
        borderBottomColor: greyBlue,
        marginLeft: px(-6)
      }
    },
  ({ place }) =>
    place === 'top' && {
      '&::after': {
        left: '50%',
        top: '100%',
        borderTopColor: greyBlue,
        marginLeft: px(-6)
      }
    }
)

export const TooltipTitle = glam.div({
  fontSize: px(15),
  marginBottom: px(10)
})

/**
 * Tooltip
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
const Tooltip = ({
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
    <ReactTooltip
      effect="solid"
      css={{ TooltipRoot }}
      type="null"
      {...{ id, place }}
    >
      <TooltipRoot {...props} place={place}>
        {children}
      </TooltipRoot>
    </ReactTooltip>
  </Fragment>
)

Tooltip.propTypes = {
  children: any.isRequired,
  trigger: node.isRequired,
  id: string.isRequired,
  place: oneOf(['top', 'bottom', 'left', 'right']),
  onEvents: arrayOf(oneOf(['click', 'focus', 'hover', 'dblclick'])),
  offEvents: arrayOf(oneOf(['click', 'focus', 'hover', 'dblclick']))
}

export { Tooltip }
