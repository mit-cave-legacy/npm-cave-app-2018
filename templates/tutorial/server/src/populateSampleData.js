import fs from 'fs-extra'
import { L, genSeqId } from 'log-file-db'
import { update, scenarioDir } from './scenarios'

const go = async () => {
  await fs.mkdirs(scenarioDir)

  console.log('generating example scenario', scenarioDir)

  let id = genSeqId()
  await update(
    id,
    L.put({
      id,
      name: 'Vanilla',
      description: 'The base scenario ready for tampering',
    })
  )
  console.log('Done.')
}

go().catch(err => {
  console.error(err)
})
