import byline from 'byline'
import { modelEvent, scenarioEvent } from 'mit-cave'
import execa from 'execa'
import { resolve } from 'path'
import * as R from 'ramda'
import {
  update as updateScenario,
  get as getScenario,
  getRunOutput
} from '../scenarios'
import { regEventFx } from '../store'
import { L } from 'log-file-db'
import { getIsModelRunning } from '../subs'
import { calcModelInputHash } from '../common'

const capturePercentProgress = /\[([0-9]*)%\]/

const safeInt = str => {
  try {
    return parseInt(str)
  } catch (err) {
    return NaN
  }
}


let runningProcess = null
regEventFx(modelEvent.CANCEL, () => {
  if (!runningProcess) return
  runningProcess.kill()
})

regEventFx(
  modelEvent.RUN,
  async ({ db, broadcast, getState, setState }, _, id) => {
    try {
      if (getIsModelRunning(db)) return
      /*
       * Write out merged file
       * Right now it just takes the "overrides" in the state file and merges them
       * over the base node definitions in background-data.
       * This can represent any final pre-processing needed before passing off
       * to the model.
       * */
      const timestamp = Date.now()
      const scenario = await getScenario(id)
      const version = scenario._version
      const filePath = resolve(__dirname, '../../run-model/run-model.js')
      const modelRun = {
        timestamp,
        scenarioId: scenario.id,
        version,
        output: [],
        percentProgress: 0
      }
      console.log(`Running model "${scenario.name}@${scenario._version}"`)
      setState(R.assoc('modelRun', modelRun))
      broadcast(['general', modelEvent.RUN_STARTED, modelRun])
      /* Execute */
      runningProcess = execa('node', [filePath, id])

      const addOutput = data => {
        const out = data.toString()
        const percentProgressCapture = capturePercentProgress.exec(out)
        const state = getState()
        const lastModelRun = R.prop('modelRun', state)
        const percentProgress = percentProgressCapture
                                ? safeInt(percentProgressCapture[1])
                                : R.prop('percentProgress', lastModelRun)
        console.log(percentProgress + '%')
        const newModelRun = R.merge(lastModelRun, {
          percentProgress,
          output: R.append(out, R.prop('output', lastModelRun))
        })
        setState(R.assoc('modelRun', newModelRun))
        broadcast(['general', modelEvent.RUN_PROGRESS, newModelRun])
      }
      byline(runningProcess.stdout).on('data', addOutput)
      byline(runningProcess.stderr).on('data', addOutput)
      await runningProcess
      runningProcess = null

      const revisedScenario = await updateScenario(
        id,
        L.assoc('lastRun', {
          timestamp,
          version,
          /* Create a hash of the fields that the optimizer actually uses */
          inputHash: calcModelInputHash(scenario)
        }),
        { channel: 'server' } //put there by the server so cannot be undone by client
      )

      const scenarioOutput = await getRunOutput(id, version)
      let newModelRun = R.merge(R.prop('modelRun', getState()), {
        timestamp: Date.now(),
        done: true
      })
      /* You can always chain multiple effects using an array instead of a map */
      return [
        ['db', R.dissoc('modelRun')],
        ['broadcast', ['general', modelEvent.RUN_FINISHED, newModelRun]],
        [
          'broadcast',
          [
            `scenario/${id}`,
            scenarioEvent.UPDATED_FULL_SCENARIO,
            revisedScenario
          ]
        ],
        ['broadcast', [`scenario/${id}`, modelEvent.RUN_OUTPUT, scenarioOutput]]
      ]
    } catch (err) {
      runningProcess = null
      if (err.killed) {
        const modelRun = R.prop('modelRun', getState())
        let newModelRun = R.merge(modelRun, {
          done: true,
          output: R.append('----CANCELLED-----', modelRun.output)
        })
        return {
          db: R.dissoc('modelRun'),
          broadcast: ['general', modelEvent.RUN_CANCELLED, newModelRun]
        }
      }
      console.error(err)
      return {
        db: R.dissoc('modelRun'),
        broadcast: ['general', modelEvent.RUN_FAILURE, err]
      }
    }
  }
)
