import glam, { Div, P, Span } from 'glamorous'
import * as PropTypes from 'prop-types'
import React from 'react'
import { IconCancel } from '../icons/IconCancel'

import { greyBlue, mediumGrey, offWhite, px, radiantGraphite } from '../theme'

const { string, object } = PropTypes

const MessageRoot = glam.div(
  //the entire message box
  { propsAreCssOverrides: true },
  {
    position: 'relative',
    fontSize: px(13),
    fontWeight: '100',
    margin: px(0),
    padding: `${px(24)} ${px(28)}`,
    width: px(408),
    display: 'inline-block',
    backgroundColor: radiantGraphite,
    color: offWhite,
    border: `${px(1)} solid ${greyBlue}`,
    borderRadius: px(24)
  }
)

/**
 * Message
 * @param title
 * @param subtitle
 * @param badgeGroup
 * @param date
 * @param button1
 * @param button2
 * @param children
 * @param props
 * @returns {*}
 * @constructor
 */
export const Message = ({
  title,
  subtitle,
  badgeGroup,
  date,
  button1,
  button2,
  children,
  ...props
}) => (
  <MessageRoot {...props}>
    <IconCancel
      size={px(18)}
      css={{ position: 'absolute', right: px(20), top: px(20) }}
    />

    <Div
      css={{
        fontSize: px(20),
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {title}
    </Div>

    <Span
      css={{
        fontSize: px(15),
        fontWeight: 500
      }}
    >
      {subtitle}
    </Span>

    <P
      css={{
        padding: `${px(12)} ${px(0)} ${px(0)} ${px(0)}`,
        margin: px(0)
      }}
    >
      {children}
    </P>

    <Div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        margin: 0
      }}
    >
      {badgeGroup && badgeGroup}
      {date && (
        <P
          css={{
            marginLeft: 'auto',
            color: `${mediumGrey}`,
            marginTop: px(12),
            marginRight: px(0),
            marginBottom: px(0),
            padding: px(0)
          }}
        >
          {date}
        </P>
      )}
    </Div>

    <Div
      css={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .cave-button': {
          margin: `${px(24)} ${px(0)} ${px(0)} ${px(0)}`,
          height: px(36),
          width: px(120),
          fontSize: px(15),
          borderRadius: px(8)
        }
      }}
    >
      {button1 && button1}
      {button2 && button2}
    </Div>
  </MessageRoot>
)

Message.propTypes = {
  title: string.isRequired,
  message: string.isRequired,
  subtitle: string,
  date: string,
  button1: object,
  button2: object,
  badgeGroup: object
}
