import * as R from 'ramda'
import { dataEvent, sessionEvent, modelEvent, scenarioEvent } from 'mit-cave'
import {
  createScenario,
  del as delScenario,
  get as getScenario,
  getHistory,
  getRunOutput,
  getScenarioSummaries,
  update as updateScenario
} from '../scenarios'
import { regEventFx } from '../store'
import { getSessionMetadata } from '../subs'
import { topics } from '../topics'

const indexById = R.indexBy(R.prop('id'))

regEventFx(scenarioEvent.SUBSCRIBE_TO_SCENARIO_LIST, async () => ({
  subscribe: topics.SCENARIO_METADATA,
  emit: [
    scenarioEvent.UPDATED_SUMMARIES,
    indexById(await getScenarioSummaries())
  ]
}))

regEventFx(scenarioEvent.SUBSCRIBE, async ({ db }, _, id) => {
  if (id == null) return
  const scenario = await getScenario(id)
  if (!scenario) return

  const scenarioOutput = scenario.lastRun
    ? await getRunOutput(scenario.id, scenario.lastRun.version)
    : null
  let messages = [[scenarioEvent.UPDATED_FULL_SCENARIO, scenario]]
  if (scenarioOutput)
    messages = R.append([modelEvent.RUN_OUTPUT, scenarioOutput], messages)
  return {
    dispatch: [scenarioEvent.SUBSCRIBE_TO_HISTORY, id],
    unsubscribe: `scenario/*`,
    subscribe: `scenario/${id}`,
    emitN: messages
  }
})

/* handled separately for speed */
regEventFx(scenarioEvent.SUBSCRIBE_TO_HISTORY, async (stuff, name, id) => {
  const history = await getHistory(id)
  return {
    emit: [scenarioEvent.ALL_TX, [id, history.tx]]
  }
})

const getSessionIdFor = (db, socketId) =>
  R.path(['clients', socketId, 'sessionId'], db)
export const getSessionTopicFor = (db, socketId) =>
  `session/${getSessionIdFor(db, socketId)}`

const updateSessionVar = R.curry((socketId, varName, value, db) =>
  R.assocPath(
    ['sessions', getSessionIdFor(db, socketId), 'selections', varName],
    value,
    db
  )
)

/*
 * An example of a client sending up a specific "request event"
 * Because we have a specific event, it is easier to add custom logic
 * In this case, we are broadcasting the fact that session meta info changed
 * (because scenario is the only thing we want to include in the "all sessions" broadcast)
 * */
regEventFx(scenarioEvent.SELECT, ({ db, socket }, _, id) => {
  const nextDb = updateSessionVar(socket.id, 'scenario', id, db)
  const sessionMeta = getSessionMetadata(nextDb)[
    getSessionIdFor(nextDb, socket.id)
  ]
  return {
    db: nextDb,
    /* Summary information changed for endpoints watching the list of all sessions */
    broadcast: [
      'sessions',
      dataEvent.COLLECTION_ITEM_UPDATED,
      ['sessions', sessionMeta]
    ],
    /* Detailed information changed for endpoints watching just one session */
    rebroadcast: [
      getSessionTopicFor(db, socket.id),
      sessionEvent.CHANGE_VAR,
      {
        varName: 'scenario',
        value: id
      }
    ]
  }
})

/* Add/delete scenarios */
regEventFx(scenarioEvent.DELETE, async ({ db }, _, id) => {
  await delScenario(id)
  let fx = [
    ['broadcast', [topics.SCENARIO_METADATA, scenarioEvent.DELETED, id]]
  ]
  return fx
})

regEventFx(scenarioEvent.ADD, async ({ db, socket }, _, scenario) => {
  const s2 = await createScenario(scenario)
  const { id } = s2
  return [
    ['db', updateSessionVar(socket.id, 'scenario', id)],
    ['broadcast', [topics.SCENARIO_METADATA, scenarioEvent.ADDED, s2]],
    [
      'broadcast',
      [
        getSessionTopicFor(db, socket.id),
        sessionEvent.VAR_CHANGED,
        {
          varName: 'scenario',
          value: id
        }
      ]
    ]
  ]
})

/**
 * Generic scenario mutation driven by the client
 * (If you want to protect operations you could have the server
 * generate the mutation instructions instead)
 * */

regEventFx(
  scenarioEvent.MUTATION,
  async (__, _, [scenarioId, mutation, meta]) => {
    if (!scenarioId) {
      console.warn('attempting to mutate but scenario id is null or empty')
      return
    }
    await updateScenario(scenarioId, mutation, { meta })
    const scenario = await getScenario(scenarioId)
    const op = R.last((await getHistory(scenarioId)).tx)
    console.log('OP', op)
    return [
      [
        'broadcast',
        [topics.SCENARIO_METADATA, scenarioEvent.UPDATED_SUMMARY_ITEM, scenario]
      ],
      [
        'broadcast',
        [`scenario/${scenarioId}`, scenarioEvent.MUTATED, [scenarioId, op]]
      ]
    ]
  }
)
