import fs from 'fs-extra'
import { collection, genSeqId, L } from 'log-file-db'
import { resolve } from 'path'
import * as R from 'ramda'

const scenarioCollection = collection(
  resolve(__dirname, '../..', 'data', 'scenarios'),
  {
    useDirsForDocs: true,
    includeVersion: true
  }
)

export const {
  getSummaries,
  get,
  getHistory,
  del,
  update,
  duplicate,
  dir: scenarioDir
} = scenarioCollection

export const getScenarioSummaries = async () => {
  await fs.ensureDir(scenarioCollection.dir)
  return await getSummaries()
}

export const createScenario = async s => {
  const newId = genSeqId()
  const s2 = R.merge(s, {
    id: newId
  })
  await update(newId, L.put(s2))
  return s2
}

export const getRunOutputPath = (id, version) =>
  resolve(`../data/scenarios/${id}/runs/${version}.run.json`)

export const getRunOutput = async (id, version) => {
  const output = await fs.readJson(getRunOutputPath(id, version))
  if (output) return R.assoc('id', id, output)
  return null
}
