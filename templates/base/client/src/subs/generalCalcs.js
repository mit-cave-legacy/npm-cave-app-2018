import * as R from 'ramda'
import { derive } from '../common/reselect'
import { getRouterQuery } from '../features'

export const getOverallLayout = derive(
  [getRouterQuery],
  R.propOr('bottom-strict', 'layout')
)
