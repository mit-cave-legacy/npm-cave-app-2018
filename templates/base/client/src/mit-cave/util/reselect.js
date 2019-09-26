import { mapKeys } from './ramdaHelpers'
import {
  createDiffSelector,
  createSelector,
  createStructuredSelector
} from './reselect-raw'

/*
 * derive (fn, fn)
 * der * dervie ('foo', [fn,fn],fn)
ive ([fn,fn], fn)
 * derive ('foo', [fn,fn],fn)
 * derive ([fn,fn],fn, {name:'foo', useValueHash:true})
 */
const makeDerive = createSelector => {
  return (...args) => {
    if (typeof args[0] === 'string') {
      const sel = createSelector.apply(null, args.slice(1))
      sel.selectorName = args[0]
      return sel
    }
    if (typeof args[args.length - 1] === 'object') {
      const { name, logIt, useValueHash } = args[args.length - 1]
      const sel = createSelector.apply(null, args.slice(0, args.length - 1))
      if (name) sel.selectorName = name
      if (logIt) sel.logIt = logIt
      if (useValueHash) sel.useValueHash = useValueHash
      return sel
    }
    return createSelector.apply(null, args)
  }
}
const derive = makeDerive(createSelector)
const deriveDiff = makeDerive(createDiffSelector)

const caseFirst = str => str[0].toLowerCase() + str.substring(1)

/* Converts anything of the form `getBar` to `bar` */
const createSub = obj =>
  createStructuredSelector(
    mapKeys(
      key => (key.startsWith('get') ? caseFirst(key.substr(3)) : key),
      obj
    )
  )

export const createParameterizedSub = (maker, memoizeBy) => {
  if (!memoizeBy || typeof memoizeBy !== 'function')
    throw new Error('Must supply a memoization key function as second argument')
  let subs = {}
  return (db, props) => {
    const key = memoizeBy(props)
    // if (subs[key]) console.log(key, subs[key](db))
    if (subs[key]) return subs[key](db)
    subs[key] = maker(props)
    return subs[key](db)
  }
}

export { createSub, derive, deriveDiff }
