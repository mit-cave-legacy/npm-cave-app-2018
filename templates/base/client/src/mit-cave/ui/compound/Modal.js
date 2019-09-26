import glam, { Div } from 'glamorous'
import * as PropTypes from 'prop-types'
import React from 'react'
import { IconCancel } from '../icons/IconCancel'

import { greyBlue, offWhite, px, radiantGraphite } from '../theme'
import { WithInputter } from './AutoInputter'
import { KEYBOARD_HEIGHT } from './Keyboard'

const { string } = PropTypes

const MODAL_WIDTH = 424
const ModalRoot = glam.div({
  fontSize: px(13),
  backgroundColor: radiantGraphite,
  fontWeight: 'normal',
  // padding: `${px(24)}`,
  minWidth: px(MODAL_WIDTH),
  minHeight: px(KEYBOARD_HEIGHT + 100),
  // width: px(424),
  display: 'block',
  color: offWhite,
  border: `${px(1)} solid ${greyBlue}`,
  borderRadius: px(24)
})

const ModalRow = glam.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&>:first-child': {
    width: '100%'
  }
})

const ToggleButtons = glam.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .cave-button': {
    height: px(36),
    fontSize: px(15),
    borderRadius: px(8),
    minWidth: px(120)
  }
})

/**
 * A modal container. Does NOT contain code for hiding/showing/floating. That should be provided
 * by a parent container. CenteredInPage can be used, and  ReactDOM.createPortal can be used
 * as needed to render into the '#root' element (needed if you are nesting the modal in
 * a container with overflow or that is already offset from client 0,0)
 * @param className
 * @param title
 * Title to show in the title bar.
 * @param stepper
 * @param button1
 * @param button2
 * @param children
 * Main body
 * @param inputOnLeft
 * @param autoInput
 * @param inputter
 * @param width
 * @param props
 * @returns {*}
 * @constructor
 */
export const Modal = ({
  className,
  title,
  stepper,
  button1,
  button2,
  children,
  inputOnLeft = true,
  autoInput,
  inputter,
  liveInput,
  width = 424,
  ...props
}) => {
  /* Determined that this needs to know about which side the
   * inputter is on, but does not need to know its dimensions
   * Height is set at the root level as that should never change
   * Width needs to float
   */
  const transform = inputOnLeft
    ? `translate(-100%, -100%)`
    : `translate(0, -100%)`

  const content =
    autoInput || inputter ? (
      <WithInputter
        autoInput={autoInput}
        width={width}
        inputOnLeft={inputOnLeft}
        inputter={inputter}
        liveInput={liveInput}
      >
        {children}
      </WithInputter>
    ) : (
      children
    )
  return (
    <ModalRoot className={className} {...props}>
      <Div
        css={{
          fontSize: px(20),
          fontWeight: 'bold',
          display: 'block',
          textAlign: 'center',
          paddingTop: px(24),
          paddingRight: px(24),
          paddingLeft: px(24)
        }}
      >
        {title}
        <IconCancel
          size={px(16)}
          css={{
            float: 'right'
          }}
        />
      </Div>
      <div
        css={{
          height: KEYBOARD_HEIGHT,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ModalRow>{stepper && stepper}</ModalRow>
        <ModalRow>{content}</ModalRow>
      </div>
      <ToggleButtons>
        {button1 && button1}
        {button2 && button2}
      </ToggleButtons>
    </ModalRoot>
  )
}

Modal.propTypes = {
  title: string.isRequired
}
