import * as R from 'ramda'
import { appEvent } from '../common'
import { scenarioEvent } from 'mit-cave'
import { regEventFx } from '../store'

regEventFx(appEvent.SELECT_DIFF_SCENARIO, ({ db }, _, [which, id]) => ({
  db: R.assocPath(['diffs', `scenario${which}`], id),
  emitN: [
    [scenarioEvent.SELECT, id],
    [scenarioEvent.SUBSCRIBE, id]
  ]
}))
