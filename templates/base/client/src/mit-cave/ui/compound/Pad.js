import React, { Component } from 'react'
import styled, { css, cx } from 'react-emotion'
import {
  greyBlue,
  lightBlue,
  offWhite,
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding,
  standardBoxShadow
} from '../theme'
import { mouseDownToTouchDrag } from '../utils/mouseDownToTouchMove'
import { WithInputter } from './AutoInputter'

export const padSizes = {
  small: {
    width: 248
  },
  standard: {
    width: 320,
    height: 360
  },
  wide: {
    width: 480,
    height: 360
  },
  tall: {
    width: 360,
    height: 488
  }
}

const DraggableRoot = styled('div')(
  {
    label: 'draggable',
    position: 'absolute',
    boxShadow: standardBoxShadow,
    color: offWhite,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: standardBorderRounding,
    overflow: 'hidden',
    background: radiantGraphite,
    transition: 'opacity 0.4s'
  },
  ({ dragging, hide }) => ({
    border: dragging ? `solid 1px ${lightBlue}` : standardBorder,
    opacity: !hide ? 1 : 0,
    pointerEvents: !hide ? 'inherit' : 'none',
    paddingBottom: px(32)
  })
)

const DragBody = styled('div')({
  label: 'cave-draggable-body',
  height: '100%',
  overflow: 'hidden',
  '&>:first-child': {
    height: '100%'
  }
})

export const DragBarRoot = styled('div')(
  {
    label: 'cave-drag-bar',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: px(32),
    minHeight: px(32),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
    '&>:first-child,&>:last-child': {
      cursor: 'pointer'
    }
  },
  ({ dragging }) => ({
    cursor: dragging ? 'grabbing' : 'grab',
    backgroundColor: dragging ? lightBlue : greyBlue
  })
)

const PlaceholderIcon = styled('div')({
  width: px(14 + 16 * 2)
})

/**
 * Adds padding to an icon and lifts its onClick event
 * @param children
 * @returns {*}
 * @constructor
 */
const Padder = ({ children }) => (
  <div
    onClick={React.Children.only(children).props.onClick}
    className={cx(
      'cave-padder',
      css({
        label: 'padder',
        paddingLeft: px(16),
        paddingRight: px(16),
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: React.Children.only(children).props.disabled
          ? 'none'
          : 'inherit'
      })
    )}
  >
    {React.cloneElement(React.Children.only(children), { onClick: null })}
  </div>
)
const suppressPadderEvent = fn => {
  return e => {
    if (
      e.nativeEvent.path.some(
        el => el.classList && el.classList.contains('cave-padder')
      )
    ) {
      return
    }
    fn(e)
  }
}
/**
 * DragBar
 * @param iconLeft
 * @param iconRight
 * @param onMouseDown
 * @param onTouchMove
 * @param onTouchStart
 * @param onTouchEnd
 * @param children
 * @param props
 * @returns {*}
 * @constructor
 */
export const DragBar = ({
  iconLeft,
  iconRight,
  onMouseDown,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
  children,
  ...props
}) => (
  <DragBarRoot
    onMouseDown={suppressPadderEvent(onMouseDown)}
    onTouchMove={suppressPadderEvent(onTouchMove)}
    onTouchStart={suppressPadderEvent(onTouchStart)}
    onTouchEnd={suppressPadderEvent(onTouchEnd)}
    {...props}
  >
    {iconLeft ? (
      <Padder>
        {React.cloneElement(iconLeft, {
          size: iconLeft.props.size || 14
        })}
      </Padder>
    ) : (
      <PlaceholderIcon />
    )}
    <div
      css={{
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
    {iconRight ? (
      <Padder>
        {React.cloneElement(iconRight, {
          size: iconRight.props.size || 14
        })}
      </Padder>
    ) : (
      <PlaceholderIcon />
    )}
  </DragBarRoot>
)

const NO_OP = () => {}

/**
 * A floating draggable pad.
 * First child must be the drag bar
 * @param {int} x unscaled x position
 * @param {int} y unscaled y position
 * @param {boolean} keepOwnPosition whether or not this component tracks its own state position
 * @param size
         selfMove,
         children,
         className,
         hide,
         dragBar,
         iconLeft,
         iconRight,
         title,
         zIndex,
         inputter
 */
export class Pad extends Component {
  state = {
    drag: null
  }

  constructor(props) {
    super(props)
    this.handleMouseDown = mouseDownToTouchDrag({
      handleTouchStart: this.handleTouchStart,
      handleTouchMove: this.handleTouchMove,
      handleTouchEnd: this.handleTouchEnd
    })
    const {
      onDragStart = NO_OP,
      onDragMove = NO_OP,
      onDragEnd = NO_OP,
      minX = -Infinity,
      maxX = Infinity,
      minY = -Infinity,
      maxY = Infinity
    } = this.props
    Object.assign(this, {
      onDragStart,
      onDragMove,
      onDragEnd,
      minX,
      maxX,
      minY,
      maxY
    })
  }

  handleTouchStart = e => {
    const touch = e.touches[0]
    const { x = 0, y = 0 } = this.props
    this.setState({
      drag: {
        ...this.state.drag,
        x,
        y,
        offsetX: x - touch.clientX,
        offsetY: y - touch.clientY
      }
    })
    this.onDragStart()
  }

  handleTouchMove = ({ touches }) => {
    if (!this.state.drag || touches.length !== 1) return
    const { offsetX, offsetY } = this.state.drag
    const touch = touches[0]
    if (!touch) {
      this.setState({
        drag: null
      })
      return
    }
    const x = Math.min(Math.max(touch.clientX + offsetX, this.minX), this.maxX)
    const y = Math.min(Math.max(touch.clientY + offsetY, this.minY), this.maxY)

    this.setState({
      drag: {
        ...this.state.drag,
        x,
        y
      }
    })
    this.onDragMove({ x, y })
  }

  handleTouchEnd = e => {
    const { drag } = this.state
    if (!drag) return
    e.preventDefault()
    const { x, y } = drag
    this.setState({
      drag: null
    })
    this.onDragEnd({ x, y })
  }

  render() {
    const { drag } = this.state
    const {
      innerRef,
      x = 0,
      y = 0,
      size = 'standard',
      selfMove,
      children,
      className,
      hide,
      dragBar,
      iconLeft,
      iconRight,
      title,
      zIndex,
      inputter,
      autoInput,
      liveInput
    } = this.props

    /* Always fixed size! */
    const sizedByType = padSizes[size] || padSizes.standard
    const width = this.props.width || sizedByType.width
    const height = this.props.height || sizedByType.height

    const dragging = !!drag
    const dragBarArgs = {
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
      dragging
    }
    const dragBarActual = dragBar ? (
      React.cloneElement(dragBar, dragBarArgs)
    ) : (
      <DragBar
        iconLeft={iconLeft}
        iconRight={iconRight}
        {...dragBarArgs}
        children={title}
      />
    )

    /* Determined that this needs to know about which side the
     * inputter is on, but does not need to know its dimensions
     * Height is set at the root level as that should never change
     * Width needs to float
     */
    const inputOnLeft = x > window.innerHeight / 2
    const transform = inputOnLeft
      ? `translate(-100%, -100%)`
      : `translate(0, -100%)`
    const offsetX = inputOnLeft ? width / 2 : -width / 2
    const left = (selfMove && drag ? this.state.drag.x : x) + offsetX
    const top = selfMove && drag ? this.state.drag.y : y

    return (
      <DraggableRoot
        innerRef={innerRef}
        hide={hide}
        dragging={dragging}
        className={className}
        style={{
          transform,
          height: px(height),
          width: autoInput || inputter ? 'auto' : px(width),
          left: px(left),
          top: px(top),
          zIndex
        }}
      >
        <DragBody
          dragging={dragging}
          css={{
            flex: 1
          }}
        >
          {autoInput || inputter ? (
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
          )}
        </DragBody>
        {dragBarActual}
      </DraggableRoot>
    )
  }
}
