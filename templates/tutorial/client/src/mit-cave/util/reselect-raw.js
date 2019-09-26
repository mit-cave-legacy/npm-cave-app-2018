import * as R from 'ramda'

let timeInAllSelectors = 0
let stateVersion = 0
let lastVersionOut = -1
export const incStateVersion = () => {
  const msg = `${stateVersion} ${timeInAllSelectors.toFixed(2)}(ms)`
  console.log(msg)
  timeInAllSelectors = 0
  stateVersion++
}
export const getStateVersion = () => stateVersion

function defaultEqualityCheck(a, b) {
  return a === b
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false
  }
  const length = prev.length
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false
    }
  }
  return true
}

function hash(obj) {
  return JSON.stringify(obj)
}

const indented = R.memoizeWith(R.identity, times =>
  R.repeat('. ', times).join('')
)
let callChain = []
let callDepth = 0

export function defaultMemoize(func) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function() {
    const useValueHash = func.selector ? func.selector.useValueHash : null

    let args = useValueHash ? hash(arguments) : arguments
    const is = useValueHash
               ? (a, b) => a === b
               : (a, b) => areArgumentsShallowlyEqual(defaultEqualityCheck, a, b)

    if (!is(lastArgs, args)) {
      lastResult = func.apply(null, arguments)
    }

    lastArgs = args
    return lastResult
  }
}

function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs

  if (!dependencies.every(dep => typeof dep === 'function')) {
    const dependencyTypes = dependencies.map(dep => typeof dep).join(', ')
    throw new Error(
      'Selector creators expect all input-selectors to be functions, ' +
      `instead received the following types: [${dependencyTypes}]`
    )
  }

  return dependencies
}

export function createSelectorCreator(memoize, ...memoizeOptions) {
  return (...funcs) => {
    let recomputations = 0
    const resultFunc = funcs.pop()
    if (!resultFunc)
      throw new Error(
        'Expected createSelector to supply a "resultFunc" at the end'
      )
    const dependencies = getDependencies(funcs)

    let selector

    /* the result function is called with dependencies as the params
    *  so this wrapper is the one that makes sure that if the inputs are the same,
    *  return last value
    * */
    function recompute() {
      recomputations++
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments)
    }

    const memoizedResultFunc = memoize(recompute, ...memoizeOptions)

    /* The selector itself receives the db as the argument
     * This will make sure that a selector that receives the same db as last call
     * will short circuit to the last result even before its dependency check
     */
    const unmanagedSelector = defaultMemoize(function() {
      const params = []
      const length = dependencies.length

      let startTime
      let callInstance = {}
      if (selector.logIt) {
        callInstance = {
          name: selector.selectorName || '?',
          depth: callDepth,
          elapsed: -1
        }
        callChain.push(callInstance)
        callDepth++
        startTime = window.performance.now()
      }

      /* PREPARE INPUTS (dependencies) */
      for (let i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments))
      }

      if (selector.logIt) {
        callDepth--
      }

      /* INVOKE with inputs */
      const result = memoizedResultFunc.apply(null, params)

      if (selector.logIt) {
        const endTime = window.performance.now()
        callInstance.elapsed = endTime - startTime
        if (callDepth === 0) {
          timeInAllSelectors += callInstance.elapsed
          /* clear it out because we've hit root */
          const flagged = R.filter(({ elapsed }) => elapsed > 1, callChain)
          if (flagged.length > 0) {
            if (lastVersionOut < stateVersion) {
              lastVersionOut = stateVersion
              console.log(stateVersion, '--------------------STATE')
            }
            const text = R.map(
              ({ name, depth, elapsed }) =>
                `${indented(depth)}${name} ${elapsed.toFixed(2)}(ms)`,
              flagged
            ).join('\n')
            console.log(text)
          }
          callChain = []
        }
      }
      return result
    })

    /*
    * a selector may be managed -- and this may be established after definition
    * managd means it preserves its value until released (usually on one or more events)
    * */
    let lastManagedResult
    let hasManagedResult = false

    selector = function() {
      if (!selector.managed) return unmanagedSelector.apply(null, arguments)
      if (hasManagedResult) return lastManagedResult
      lastManagedResult = unmanagedSelector.apply(null, arguments)
      return lastManagedResult
    }

    recompute.selector = selector
    selector.resultFunc = resultFunc
    selector.memoizedResultFunc = memoizedResultFunc
    selector.dependencies = dependencies

    selector.recomputations = () => recomputations
    selector.resetRecomputations = () => (recomputations = 0)
    selector.manage = () => (selector.managed = true)
    selector.release = () => (selector.hasManagedResult = false)

    return selector
  }
}

export const createSelector = createSelectorCreator(defaultMemoize)

export function createStructuredSelector(
  selectors,
  selectorCreator = createSelector
) {
  if (typeof selectors !== 'object') {
    throw new Error(
      'createStructuredSelector expects first argument to be an object ' +
      `where each property is a selector, instead received a ${typeof selectors}`
    )
  }
  const objectKeys = Object.keys(selectors)
  const sub = selectorCreator(
    objectKeys.map(key => selectors[key]),
    (...values) => {
      return values.reduce((composition, value, index) => {
        composition[objectKeys[index]] = value
        return composition
      }, {})
    }
  )
  sub.selectorName = 'sub?'
  return sub
}

/*
* fancy diff selectors
* only thing different is that it calls in with previous args/results in addition to db
* */
export function lastInputOutputMemoize(func) {
  let lastArgs = null
  let lastResult = null
  let workspace = {
    lastIn: [],
    lastOut: null
  }
  // we reference arguments instead of spreading them for performance reasons
  return function() {
    const useValueHash = func.selector ? func.selector.useValueHash : null

    let args = useValueHash ? hash(arguments) : arguments
    const is = useValueHash
               ? (a, b) => a === b
               : (a, b) => areArgumentsShallowlyEqual(defaultEqualityCheck, a, b)

    if (!is(lastArgs, args)) {
      const fullArgs = Array.from(arguments).concat(workspace)
      lastResult = func.apply(null, fullArgs)
      workspace.lastOut = lastResult
    }

    lastArgs = args
    workspace.lastIn = args
    return lastResult
  }
}
export const createDiffSelector = createSelectorCreator(lastInputOutputMemoize)
