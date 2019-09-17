import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()

export const windowEvents = {
  getWindowEmitter() {
    if (!this.registered) {
      window.addEventListener('mousemove', e => emitter.emit('mousemove', e))
      window.addEventListener('mouseup', e => emitter.emit('mouseup', e))
      this.registered = true
    }
    return emitter
  },
  on(name, fn) {
    this.getWindowEmitter().on(name, fn)
    return fn
  },
  once(name, fn) {
    this.getWindowEmitter().once(name, fn)
    return fn
  },
  un(name, fn) {
    this.getWindowEmitter().removeListener(name, fn)
  },
  removeListener(name, fn) {
    this.un(name, fn)
  }
}

class EZTouchSyntheticEvent {
  constructor({ clientX, clientY, pageX, pageY }) {
    this.touches = [
      {
        clientX,
        clientY,
        pageX,
        pageY
      }
    ]
  }

  preventDefault() {}
}

const tapMoveThreshold = 10 // what it is in React
const getDistance = (coords, e) => {
  const { pageX, pageY } = e
  return Math.pow(
    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
    0.5
  )
}

/**
 * Convert mouse down / mouse move / etc. events to corresponding touch handlers
 * @param handleTouchStart
 * @param handleTouchMove
 * @param handleTouchEnd
 * @returns {Function}
 */
export const mouseDownToTouchDrag = ({
  handleTouchStart = () => {},
  handleTouchMove,
  handleTouchEnd
}) => {
  return e => {
    let initialCoords = {
      x: e.pageX,
      y: e.pageY
    }
    let beganDrag = false
    const moveFn = windowEvents.on('mousemove', e => {
      const synthEvent = new EZTouchSyntheticEvent(e)
      if (!beganDrag) {
        if (getDistance(initialCoords, e) < tapMoveThreshold) return
        handleTouchStart(synthEvent)
        beganDrag = true
      }
      handleTouchMove(synthEvent)
    })
    windowEvents.once('mouseup', e => {
      const synthEvent = new EZTouchSyntheticEvent(e)
      handleTouchEnd(synthEvent)
      windowEvents.un('mousemove', moveFn)
    })
  }
}
