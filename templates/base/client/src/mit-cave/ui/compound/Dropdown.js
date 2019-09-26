import React from 'react'
import { cx } from 'react-emotion'
import EventListener, { withOptions } from 'react-event-listener'

/**
 * A slideout dropdown container that can holds things like radio groups, etc.
 * Use sparingly for navigation, etc.
 */
export class Dropdown extends React.PureComponent {
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
    const { className, isOpen, children } = this.props
    return (
      <div
        ref={el => (this.rootEl = el)}
        className={cx('cave-dropdown', className)}
        css={{
          position: 'absolute',
          marginLeft: '-50%',
          overflow: 'hidden'
        }}
      >
        <EventListener
          target="window"
          onMouseDown={withOptions(this.handleGlobalMouseDown, {
            passive: true,
            capture: false
          })}
        />
        <div
          css={{
            transition: 'transform 150ms',
            transform: isOpen ? '' : 'translate3d(0, -100%, 0)',
            pointerEvents: isOpen ? '' : 'none'
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}
