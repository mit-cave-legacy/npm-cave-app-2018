import * as R from 'ramda'
import React, { Children } from 'react'
import styled, { css, cx } from 'react-emotion'
import EventListener, { withOptions } from 'react-event-listener'
import { lightBlue, offWhite, px, standardBoxShadow } from '../theme'

const FADE_DURATION = 500
const Btn = styled('div')({
  label: 'cave-radial-button',
  color: offWhite,
  userSelect: 'none',
  // position: 'absolute',
  // top: 0,
  // left: 0,
  minWidth: px(50),
  minHeight: px(50),
  borderRadius: '50%',
  background: 'rgba(237,237,237, 0.15)',
  opacity: 0, // transparent
  pointerEvents: 'none',
  zIndex: -10,
  display: 'flex',
  alignItems: 'center',
  boxShadow: standardBoxShadow,
  justifyContent: 'center', // center things both vertically and horizontally
  cursor: 'pointer',
  transition: `opacity ${FADE_DURATION}ms, z-index 0.15s, transform ${FADE_DURATION}ms`, // slide out effect
  '&:hover, &:active': {
    color: lightBlue
  },
  '>.cave-button': {
    borderRadius: '50%',
    height: px(50),
    width: px(50),
    opacity: 0.9
  }
})

const BtnIcon = styled(Btn)(
  {
    label: 'radial-menu-btn-icon',
    '&:hover, &:active': {
      '& .svg-icon': {
        fill: lightBlue
      }
    }
  },
  (
    { active } // when the icons are coming out, not going back
  ) =>
    active && {
      opacity: 1,
      zIndex: 50,
      pointerEvents: 'inherit'
    }
)

const Rotater = styled('div')({
  // each icon's wrapper before they come out
  label: 'cave-button-rotator',
  position: 'absolute',
  top: 0,
  left: 0
})

/**
 * Used internally within RadialMenu for each button
 *
 * @param children
 * @param active
 * @param rotate
 * @returns {*}
 * @constructor
 */
export const RotaterButton = ({ children, active, rotate }) => {
  // wrapper for rotater and button
  return (
    <Rotater
      css={{
        pointerEvents: 'none',
        transform: `translate(-50%,-50%) rotate(${rotate}deg)` // only rotate, doesn't change xy
      }}
    >
      <BtnIcon
        active={active}
        css={{
          pointerEvents: active ? 'all' : 'none',
          transform: active && `translateY(${px(-100)}) rotate(${-rotate}deg)`
        }}
      >
        {children}
      </BtnIcon>
    </Rotater>
  )
}

let lastId = 0

/**
 * Buttons that radiate from the center
 * Used usually with a map marker and "pinned" to the map using mapbox
 * Children are typically Buttons (and will receive a special style if so) though
 * any child may be used
 * @param isOpen
 * @param children
 * @param onClickaway
 * @returns {*}
 * @constructor
 */
export class RadialMenu extends React.PureComponent {
  handleGlobalMouseDown = e => {
    // suppress global clicks happening within 5ms of opening
    // as its almost 100% certain that was a click that triggered this to open
    if (this.props.onClickaway && this.props.isOpen) {
      // .closest goes up, .contains goes down...
      // const closest = e.target.closest(`#${this.uniqueId}`)
      if (!this.rootEl) return
      const isDescendant = this.rootEl.contains(e.target)
      if (isDescendant) return // originated from within
      this.props.onClickaway(e)
    }
  }

  render() {
    const { isOpen, children, className } = this.props
    const deg = 360 / Children.count(children)
    return (
      <div ref={el => (this.rootEl = el)} className={className}>
        <EventListener
          target="window"
          onMouseDown={withOptions(this.handleGlobalMouseDown, {
            passive: true,
            capture: false
          })}
        />
        {Children.map(children, (child, index) => {
          const rotate = deg / -2 + deg * index
          return (
            <RotaterButton rotate={rotate} active={isOpen}>
              {child}
            </RotaterButton>
          )
        })}
      </div>
    )
  }
}

const PositionedRadialMenu = ({ x, y, className, children, ...props }) => (
  <RadialMenu
    className={cx(
      css({
        position: 'absolute',
        top: y,
        left: x
      }),
      className
    )}
    {...props}
  >
    {children}
  </RadialMenu>
)

/**
 * A singleton radial menu that auto-creates multiple instances for animation purposes
 * but is treatable as one reusable menu from the outside. Must set a unique key
 * generator to distinguish between virtual menus.
 * @param menuKey unique key to determine "new menu" vs. "move existing menu"
 */
export class SingletonRadialMenu extends React.Component {
  state = {
    menuKey: '',
    radials: {}
  }

  static getDerivedStateFromProps(props, state) {
    const { menuKey: latestKey = 'default', ...rest } = props
    const { key, radials } = state
    let newRadials = radials
    if (latestKey) {
      newRadials = R.assoc(latestKey, { key: latestKey, ...rest }, newRadials)
    }
    const closeOldMenu =
      key &&
      (latestKey !== key || // key changed
        (!props.isOpen && R.pathEq([key, 'isOpen'], true, radials)))

    if (closeOldMenu) {
      // close old radials (preserving old props -- should preserve all the way down probably)
      const oneToClose = R.prop(key, radials)
      newRadials = R.assoc(
        key,
        R.merge(oneToClose, {
          isOpen: false,
          closedAt: Date.now()
        }),
        newRadials
      )
    }

    if (latestKey === key) {
      return {
        radials: newRadials
      }
    }

    if (latestKey && !radials[latestKey] && props.isOpen) {
      // when a new key and state is open, start off closed and then open after the update...
      newRadials = R.assocPath([latestKey, 'isOpen'], false, newRadials)
    }

    return {
      key: latestKey,
      radials: newRadials
    }
  }

  componentDidMount() {
    this.animateInAsNeeded()
  }

  componentDidUpdate(oldProps) {
    this.animateInAsNeeded()
    if (oldProps.menuKey !== this.props.menuKey) {
      window.setTimeout(() => this.cleanUpOldRadials(), 1000)
    }
  }

  componentWillUnmount() {
    this.stopCleanup = true
  }

  cleanUpOldRadials() {
    if (this.stopCleanup) return
    const now = Date.now()
    this.setState({
      radials: R.reject(
        ({ isOpen, closedAt }) =>
          !isOpen && closedAt && now - closedAt > FADE_DURATION,
        this.state.radials
      )
    })
  }

  animateInAsNeeded() {
    /* animate in as needed */
    const { isOpen } = this.props
    const { key, radials } = this.state

    if (isOpen && R.pathEq([key, 'isOpen'], false, radials)) {
      window.setTimeout(() => {
        this.setState({
          radials: R.assocPath([key, 'isOpen'], true, radials)
        })
      }, 16)
    }
  }

  render() {
    const { radials } = this.state
    return (
      <React.Fragment>
        {R.map(
          ({ children, ...r }) => (
            <PositionedRadialMenu {...r}>{children}</PositionedRadialMenu>
          ),
          R.values(radials)
        )}
      </React.Fragment>
    )
  }
}
