import { component, createRouter, derive } from 'framework-x'
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import * as R from 'ramda'
import React from 'react'
import { createSub } from '@mit-cave/util'
import { routeEvent } from './event'

export { routeEvent }
export const regRouteFeature = (
  { regEventFx, regFx, dispatch },
  { routes } = {}
) => {
  if (!routes)
    throw new Error(
      'regRouteEvents requires an array of `routes` in the options'
    )
  const getRouteId = R.pathOr('', ['router', 'match', 'route', 'id'])
  const getRouteArgs = R.pathOr({}, ['router', 'match', 'params'])
  const getSearchString = R.pathOr('', ['router', 'location', 'search'])
  const getRouterQuery = derive(getSearchString, search =>
    queryString.parse(search)
  )

  /* NOTE: Not strictly necessary to use history.js library */
  const history = createBrowserHistory()
  const { pushNamedRoute, replaceNamedRoute, listen } = createRouter({
    history,
    routes
  })

  regFx('route', args => pushNamedRoute.apply(null, args))
  regFx('redirect', args => replaceNamedRoute.apply(null, args))

  regEventFx(routeEvent.CHANGED, ({ db }, _, locationAndMatch) => {
    const { match } = locationAndMatch
    const action = R.pathOr(() => {}, ['match', 'route', 'action'])(
      locationAndMatch
    )

    const effects =
      match.id === 'not-found'
        ? { redirect: ['map', { layer: 'default' }] }
        : action(match)

    return {
      db: {
        ...db,
        router: locationAndMatch
      },
      ...effects
    }
  })

  const genRouteFx = (id, nextParams) => ({
    /* set optimistically */
    db: R.assocPath(['router', 'match'], {
      params: nextParams,
      route: R.find(R.propEq('id', id), routes)
    }),
    route: [id, nextParams]
  })
  /* Request to navigate to a link, defaulting to any previous args for that route */
  regEventFx(routeEvent.NAV_TO_LAST_ARGS, ({ db }, _, [id, params]) => {
    const existingParams = getRouteArgs(db)
    const lastParamsForRoute = R.path(['lastParamsForRoute', id])(db)
    const nextParams = R.merge(lastParamsForRoute, params || existingParams)
    return genRouteFx(id, nextParams)
  })
  /* Request to navigate to a link. Optimistically set in db to make sure effects are immediate */
  regEventFx(routeEvent.NAV_TO, ({ db }, _, [id, params]) => {
    const existingParams = getRouteArgs(db)
    const nextParams = params || existingParams
    return genRouteFx(id, nextParams)
  })

  const startRouter = () =>
    listen(locationAndMatch => {
      dispatch(routeEvent.CHANGED, locationAndMatch)
    })
  return {
    startRouter,
    getRouteArgs,
    getRouteId,
    getRouterQuery,
    RouteNotFound: component(
      'RouteNotFound',
      createSub({ getRouteId }),
      ({ routeId }) => <div>Route "{routeId}" not found</div>
    )
  }
}
