import * as R from 'ramda'
import {
  addIndex,
  concat,
  curry,
  defaultTo,
  flip,
  indexBy,
  map,
  merge,
  prop,
  reduce,
  symmetricDifference
} from 'ramda'

export const concatN = (...arrays) => reduce(concat, [], arrays)
export const filterWithKeys = R.curry((pred, obj) =>
  R.pipe(
    R.toPairs,
    R.filter(R.apply(pred)),
    R.fromPairs
  )(obj)
)

export const logIt = curry((name, selector) => state => {
  console.log('RECALCULATED', name)
  return selector(state)
})

export const mergeOp = flip(merge)

const defaultToEmpty = defaultTo([])
export const xor = curry((values, target) =>
  symmetricDifference(defaultToEmpty(target), values)
)

export const maxOf = list => R.reduce(R.max, -Infinity, list)
export const maxOfBy = curry((fn, list) => maxOf(R.map(fn, list)))

export const lookup = flip(prop)

export const mapIndexed = addIndex(map)
export const indexById = indexBy(prop('id'))

export const mapKeys = R.curry((fn, obj) =>
  R.fromPairs(R.map(R.adjust(0, fn), R.toPairs(obj)))
)

export const updateIn = R.curry((ks, f, m) =>
  R.assocPath(ks, f(R.path(ks, m)), m)
)

export const isPlainObject = a => !!a && a.constructor === Object
