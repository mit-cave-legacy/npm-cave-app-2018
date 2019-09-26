import * as R from 'ramda'
import { L, forcePath, tailReduceHistory } from 'log-file-db-client'
import { dataEvent } from 'mit-cave/data'
import { sessionEvent } from 'mit-cave/session'
import { derive, deriveDiff, updateIn } from 'mit-cave/util'
import { scenarioEvent } from './event'

export { scenarioEvent }

export const regScenarioFeature = ({ regEventFx }, {
  SESSION_VARS = 'sessionVars'
} = {}) => {

  /* SELECTORS */
  const getCurrentScenarioId = R.path([SESSION_VARS, 'scenario'])

  /**
   * Current scenario transaction history
   * */
  const getCurrentScenarioTx = db =>
    R.path(['fullScenariosTx', getCurrentScenarioId(db)], db)

  /**
   * "tails" any new log history coming in and turns to realized history
   * differentially
   */
  const getRealizedHistory = deriveDiff([getCurrentScenarioId, getCurrentScenarioTx],
    (id, tx, { lastIn: [lastId, lastTx = []], lastOut: lastHistory }) => {
      if (tx == null) return null
      if (id !== lastId) {
        // switched scenarios so clear calcs
        lastTx = []
        lastHistory = null
      }
      const nextHistory = tailReduceHistory(
        lastTx,
        lastHistory,
        tx
      )
      // console.log(R.last(nextHistory.snapshots).state.nodes)
      return nextHistory
    })

  /**
   * Get state as derived from the realized transaction log
   * This state may take a few extra ms to load, but can be
   * efficiently differentially updated and used for quick undos/redos
   * at any size
   */
  const getLastSnapshot = derive(getRealizedHistory, history => {
    return history ? R.last(history.snapshots) : null
  })
  const getUndoListIds = derive(getLastSnapshot, R.propOr([], 'undoList'))
  const getUndoList = derive([getRealizedHistory, getUndoListIds], (history, undoIds) => {
    if (!history) return []
    return R.map(id => history.tx[id], undoIds)
  })
  const getRealizedState = derive(getLastSnapshot, R.propOr(null, 'state'))
  const getUndoPlayhead = derive(getLastSnapshot, R.propOr(0, 'undoPlayhead'))
  const getVisibleUndoList = derive(getUndoList, getUndoPlayhead,
    (list, playhead) => R.reverse(R.slice(1, playhead + 1, list)))

  /** NOTE: Some parts of scenarios such as nodes,
   * are diff overlays and not the whole data representation */

  /**
   * Get state as sent by the server as "final state"
   * This is just a speed optimization in case the scenario is huge
   * And is not really necessary
   * That is, the current final state can be sent before the transaction log
   * is hydrated.
   */
  const getFullScenarios = R.propOr({}, 'fullScenarios')
  const getCurrentFullScenario = derive(
    [getCurrentScenarioId, getFullScenarios],
    R.prop
  )

  /**
   * Get summary state as provided by the server on connect for all scenarios
   * And maintained as summary data changes
   */
  const getScenarioSummaryMap = R.propOr([], 'scenarios')
  const getScenarioSummaries = derive(getScenarioSummaryMap, R.values)
  const getCurrentScenarioSummary = derive(
    [getCurrentScenarioId, getScenarioSummaryMap],
    R.prop
  )

  /**
   * Present a single view of the current scenario data, in order of preference:
   * 1) from the realized tx log sent down on subscribe
   * 2) from the cached final state sent down by the server on subscribe
   * 3) from the summary data sent down to the server on connection
   * */
  const getCurrentScenario = derive(
    [getRealizedState, getCurrentFullScenario, getCurrentScenarioSummary],
    (realized, full, summary) => realized || full || summary
  )

  /**
   * Scenario add/edit
   */
  const getScenarioToAdd = R.prop('scenarioToAdd')
  const getScenarioInDetail = derive(
    [R.prop('scenarioInDetail'), getScenarioSummaryMap],
    R.prop
  )
  /* for the scenario detail editor -- switches which one being edited */
  const getScenarioDetail = derive(
    [getScenarioToAdd, getScenarioInDetail],
    (scenarioToAdd, scenarioInDetail) => scenarioToAdd || scenarioInDetail
  )
  const getCurrentScenarioVersion = derive(
    getCurrentFullScenario,
    R.pathOr('-', ['_version'])
  )

  /* EVENTS */
  /* Ask for scenarios on socket connect */
  regEventFx(dataEvent.SOCKET_CONNECTED, () => ({
    emitN: [[scenarioEvent.SUBSCRIBE_TO_SCENARIO_LIST]]
  }))

  /* Ask for specific scenario when we have session variables */
  regEventFx(sessionEvent.INITIAL_VARS, (__, _, selections) => ({
    emit: [scenarioEvent.SUBSCRIBE, selections.scenario]
  }))

  // helper method to strip nodes out of summary copies...
// This is just to help simulate the case where the "summary" version of scenarios
// is less than the full model output
  const omitNodes = R.omit(['nodes'])
// summary list
  regEventFx(scenarioEvent.UPDATED_SUMMARIES, (__, _, scenarios) => ({
    db: R.assoc('scenarios', R.map(omitNodes, scenarios))
  }))

// update of a summary item in list
  regEventFx(scenarioEvent.UPDATED_SUMMARY_ITEM, (__, _, scenario) => ({
    db: R.assocPath(['scenarios', scenario.id], omitNodes(scenario))
  }))

// request scenario detail from server on selection
  regEventFx(scenarioEvent.SELECT, (__, _, id) => ({
    db: R.assocPath([SESSION_VARS, 'scenario'], id),
    emitN: [[scenarioEvent.SELECT, id], [scenarioEvent.SUBSCRIBE, id]]
  }))

  /* store updated scenario detail */
  regEventFx(scenarioEvent.UPDATED_FULL_SCENARIO, (__, _, scenario) => ({
    db: R.assocPath(['fullScenarios', scenario.id], scenario)
  }))

  regEventFx(scenarioEvent.ALL_TX, (__, _, [id, tx]) => {
    return ({
      db: R.assocPath(['fullScenariosTx', id], tx)
    })
  })

  /* SCENARIO CRUD operations */

  /* Open a possible new scenario. Won't be saved until "add_scenario" */
  regEventFx(scenarioEvent.BEGIN_ADD, () => ({
    db: R.pipe(
      R.assoc('scenarioToAdd', {
        name: '',
        description: ''
      }),
      R.assoc('scenarioInDetail', '{{{new}}}')
    )
  }))

// Open for view/edit
  regEventFx(scenarioEvent.OPEN_DETAIL, (__, _, id) => ({
    db: R.assoc('scenarioInDetail', id)
  }))

// Close for view/edit
  regEventFx(scenarioEvent.CLOSE_DETAIL, (__, _, id) => ({
    db: R.pipe(
      R.dissoc('scenarioInDetail'),
      R.dissoc('scenarioToAdd')
    )
  }))

// Add newly created scenario scenario
  regEventFx(scenarioEvent.ADD, ({ db }) => ({
    db: R.pipe(
      R.dissoc('scenarioInDetail'),
      R.dissoc('scenarioToAdd')
    ),
    emit: [scenarioEvent.ADD, getScenarioToAdd(db)]
  }))

  regEventFx(scenarioEvent.DELETE, (__, _, id) => {
    return {
      emit: [scenarioEvent.DELETE, id]
    }
  })

  regEventFx(scenarioEvent.DELETED, ({ db }, _, id) => ({
    db: R.pipe(
      R.dissocPath(['scenarios', id]),
      R.ifElse(
        R.propEq('scenarioInDetail', id),
        R.dissoc('scenarioInDetail'),
        R.identity
      )
    )
  }))

  /* Received new scenario summary */
  regEventFx(scenarioEvent.ADDED, ({ db }, _, s) => ({
    db: R.assocPath(['scenarios', s.id], s)
  }))

  const emitMutation = (scenarioId, mutation, triggeringEvent) => [
    'emit',
    [scenarioEvent.MUTATION, [scenarioId, mutation, triggeringEvent]]]

  /**
   * Change a value through the detail form; may just be updating value of "new scenario"
   * Since this can be for any arbitrary scenario (strange), uses a different path
   * through the system.
   */
  regEventFx(
    scenarioEvent.CHANGE_VALUE_IN_SCENARIO_EDITOR,
    ({ db }, __, [scenarioId, pathOrProp, value]) => {
      const path = R.is(Array, pathOrProp) ? pathOrProp : [pathOrProp]
      const scenarioToAdd = getScenarioToAdd(db)
      if (scenarioToAdd) {
        return {
          db: R.assocPath(['scenarioToAdd'].concat(path), value)
        }
      }
      const meta = [scenarioEvent.CHANGE_SCENARIO_VALUE, [forcePath(path), value]]
      return [
        ['db', R.assocPath(['scenarios', scenarioId].concat(path), value)],
        emitMutation(scenarioId, L.assoc(path, value), meta)
      ]
    }
  )

  /**
   * MUTATION OUT
   * Change a value in the current scenario
   * Just sends out mutation and lets the server do the rest
   **/
  regEventFx(
    scenarioEvent.CHANGE_CURRENT_VALUE,
    ({ db }, __, [path, value]) => {
      const scenarioId = getCurrentScenarioId(db)
      if (scenarioId == null) return //no op
      const meta = [scenarioEvent.CHANGE_SCENARIO_VALUE, [forcePath(path), value]]
      return [emitMutation(scenarioId, L.assoc(path, value), meta)]

    }
  )

  /**
   * MUTATION OUT
   * Change a value in a NODE in the current scenario
   * Just sends out mutation and lets the server do the rest
   **/
  regEventFx(
    scenarioEvent.CHANGE_NODE_VALUE,
    ({ db }, __, [nodeId, path, value]) => {
      const scenarioId = getCurrentScenarioId(db)
      if (scenarioId == null) return //no op
      const finalPath = forcePath(path)
      const sPath = ['nodes', nodeId].concat(finalPath)
      const meta = [scenarioEvent.CHANGE_NODE_VALUE, [nodeId, finalPath, value]]
      return [emitMutation(scenarioId, L.assoc(sPath, value), meta)]
    }
  )

  regEventFx(
    scenarioEvent.UNDO,
    ({ db }) => {
      const scenarioId = getCurrentScenarioId(db)
      if (scenarioId == null) return //no op
      const meta = [scenarioEvent.UNDO, []]
      return [emitMutation(scenarioId, L.undo(), meta)]
    }
  )

  regEventFx(
    scenarioEvent.REDO,
    ({ db }) => {
      const scenarioId = getCurrentScenarioId(db)
      if (scenarioId == null) return //no op
      const meta = [scenarioEvent.REDO, []]
      return [emitMutation(scenarioId, L.redo(), meta)]
    }
  )

  regEventFx(
    scenarioEvent.RESET_NODES,
    ({ db }, _, ids) => {
      const scenarioId = getCurrentScenarioId(db)
      if (scenarioId == null) return //no op
      const meta = [scenarioEvent.RESET_NODES, ids]
      const mutation = L.omit(['nodes'], ids)
      return [emitMutation(scenarioId, mutation, meta)]
    }
  )

  /**
   * MUTATION IN
   * Receive mutations from server and append to log
   * */
  regEventFx(
    scenarioEvent.MUTATED,
    ({ db }, __, [id, mutation]) => ({
      db: updateIn(['fullScenariosTx', id], R.append(mutation), db)
    }))

  return {
    getCurrentScenarioId,
    getScenarioSummaryMap,
    getScenarioSummaries,
    getCurrentScenarioSummary,
    getFullScenarios,
    getCurrentFullScenario,
    getCurrentScenario,
    getScenarioToAdd,
    getScenarioDetail,
    getCurrentScenarioVersion,
    getCurrentScenarioTx,
    getRealizedHistory,
    getLastSnapshot,
    getRealizedState,
    getUndoList,
    getUndoPlayhead,
    getVisibleUndoList
  }
}
