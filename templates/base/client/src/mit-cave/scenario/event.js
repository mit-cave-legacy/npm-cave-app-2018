export const scenarioEvent = {
  SUBSCRIBE_TO_SCENARIO_LIST: 'scenario/subscribe-to-list',
  SUBSCRIBE: 'scenario/subscribe',
  SUBSCRIBE_TO_HISTORY: 'scenario/subscribe-to-history',
  UPDATED_SUMMARIES: 'scenario/updated-summaries',
  UPDATED_SUMMARY_ITEM: 'scenario/updated-summary-item',
  UPDATED_FULL_SCENARIO: 'scenario/updated-full',
  SELECT: 'scenario/scenario',
  // Change a scenario value (the two next ones are just local helpers for this)
  // This is saved in history
  CHANGE_SCENARIO_VALUE: 'scenario/change-scenario-value',

  // Assoc value in current scenario
  CHANGE_CURRENT_VALUE: 'scenario/change-current-value',
  // Assoc value with detail -- which is live if an existing scenario, local otherwise
  CHANGE_VALUE_IN_SCENARIO_EDITOR: 'scenario/change-detail-value',

  // Change a node
  // this is saved in history
  // could be made generic for 'entity'
  CHANGE_NODE_VALUE: 'scenario/change-node-value',

  CLOSE_DETAIL: 'scenario/close-detail',
  OPEN_DETAIL: 'scenario/open-detail',
  // Enter into the add scenario form
  BEGIN_ADD: 'scenario/begin-add',
  // Save the results of the add scenario form
  ADD: 'scenario/add',
  //NOTE: scenario *edits* are all live
  DELETE: 'scenario/delete',
  DELETED: 'scenario/deleted',
  ADDED: 'scenario/added',
  ADD_NODE: 'add-node',
  NODE_ADDED: 'node-added',
  ALL_TX: 'scenario/all-tx',
  MUTATION: 'scenario/mutation',
  MUTATED: 'scenario/mutation',

  UNDO: 'scenario/undo',
  REDO: 'scenario/redo',
  RESET_NODES: 'scenario/reset-nodes'
}
