import * as R from 'ramda'

export const enforceArgsNotNull = (methodName, args) => {
  const badArgs = R.pipe(
    R.toPairs,
    R.filter(([name, value]) => R.isNil(value)),
    R.map(([name, value]) => `"${name}"`)
  )(args)
  if (badArgs.length > 0)
    throw new Error(
      `'${methodName}' expected to be supplied ${R.join(', ', badArgs)}`
    )
}
