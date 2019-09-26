import fs from 'fs-extra'
import { L, genSeqId } from 'log-file-db'
import { update, scenarioDir } from './scenarios'
import { defaultScenario } from './defaultScenario'

const go = async () => {
  console.log(defaultScenario.id)
  await fs.mkdirs(scenarioDir)
  await update(defaultScenario.id, L.put(defaultScenario))
}

go().catch(err => {
  console.error(err)
})
