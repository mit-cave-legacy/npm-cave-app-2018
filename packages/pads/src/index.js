import { css } from 'emotion'
import * as R from 'ramda'
import React from 'react'
import { IconCancel, pxNum } from '@mit-cave/ui'
import { coreEvent } from '@mit-cave/core'
import { mergeOp } from '@mit-cave/util'
import { padEvent } from './event'

export { padEvent }

const showPad = R.curry((pad, db) => {
  const newId = R.inc(R.prop('padMaxZ', db))
  return R.pipe(
    R.assoc('padMaxZ', newId),
    R.assocPath(['pads', pad, 'zIndex'], newId),
    R.assocPath(['pads', pad, 'show'], true)
  )(db)
})

const updatePadPos = (name, x, y) =>
  R.assocPath(['pads', name, 'pos'], { x, y })

const hidePad = R.curry((pad, db) =>
  R.assocPath(['pads', pad, 'show'], false)(db)
)

/**
 * Add pad show, hide, toggle, drag, etc. event handling
 * @param dispatch
 * @param regEventFx
 */
export const regPadFeature = ({ dispatch, regEventFx }) => {
  /* SELECTORS */
  const getPad = R.curry((name, db) => R.pathOr({}, ['pads', name], db))
  const getPadPos = R.curry((name, db) =>
    R.pathOr({}, ['pads', name, 'pos'], db)
  )

  /* EVENTS */
  regEventFx(coreEvent.INITIALIZE_DB, () => ({
    db: mergeOp({
      pads: {},
      padMaxZ: 1000
    })
  }))
  regEventFx(padEvent.DRAG_START, ({ db }, _, [pad, pos]) => {
    // Bump zIndex
    const newId = R.inc(R.prop('padMaxZ', db))
    return {
      db: R.pipe(
        R.assoc('padMaxZ', newId),
        R.assocPath(['pads', pad, 'zIndex'], newId)
      )
    }
  })
  regEventFx(padEvent.DRAG_END, (__, _, [pad, pos]) => ({
    db: R.assocPath(['pads', pad, 'pos'], pos)
  }))
  regEventFx(padEvent.SHOW, (__, _, pad) => ({ db: showPad(pad) }))
  regEventFx(padEvent.HIDE, (__, _, pad) => ({ db: hidePad(pad) }))
  regEventFx(padEvent.TOGGLE, ({ db }, _, pad) => ({
    db: R.path(['pads', pad, 'show'], db) ? hidePad(pad) : showPad(pad)
  }))

  const withInitialBottomPos = (x, pos) =>
    pos || {
      x: window.innerWidth / 2 + pxNum(x),
      y: window.innerHeight - pxNum(80)
    }

  const withWiredPadProps = ({ padId, pad, defaultX = 0 }) => {
    return {
      className: css({
        transform: 'translate(0,-100%)'
      }),
      selfMove: true,
      onDragStart: pos => dispatch(padEvent.DRAG_START, [padId, pos]),
      onDragEnd: pos => dispatch(padEvent.DRAG_END, [padId, pos]),
      hide: !pad.show,
      zIndex: pad.zIndex,
      ...withInitialBottomPos(defaultX, pad.pos),
      iconRight: <IconCancel onClick={() => dispatch(padEvent.HIDE, padId)} />,
      minX: 0,
      maxX: window.innerWidth - 200,
      minY: 200,
      maxY: window.innerHeight
    }
  }

  return {
    getPad,
    getPadPos,
    showPad,
    updatePadPos,
    withWiredPadProps
  }
}
