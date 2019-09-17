/*
 * Fake example of running a model
 * FILL THIS IN YOURSELF FOR YOUR APP
 * It receives a scenario id and then writes an output
 * It is expected to be able to load and read the current scenario state
 * Will typically be in python of course
 * */
const fs = require('fs-extra')
const { resolve } = require('path')
const R = require('ramda')

const scenarioId = process.argv[2]
if (!scenarioId) throw new Error('Must supply scenario id')

const progress = [
  'processing internal arguments... [10%]',
  'initializing flux capacitors...[20%]',
  'rearranging interstitial transport...[30%]',
  'packing model gibberish...[50%]',
  'reordering intellectual constraints...[60%]',
  'A-1 ',
  'A-2 [70%]',
  'A-3',
  'Final pass sorting through my issues...[80%]',
  'Thought we were done...[90%]',
  'Model processing complete.'
]

const randomPause = () => new Promise((resolve) => {
  setTimeout(() => resolve(), Math.random() * 600 + 300)
})
const walkThroughFakeSteps = async () => {
  for (let m of progress) {
    console.log(m)
    await randomPause()
  }
}

const go = async () => {
  /* 1) Load scenario by id from disk */
  const scenarioDir = resolve(__dirname, '../../data/scenarios', scenarioId)
  const stat = await fs.stat(scenarioDir)
  if (!stat.isDirectory()) throw new Error('Expected directory')
  const stateFile = resolve(scenarioDir, `${scenarioId}.state.json`)
  const scenario = await fs.readJSON(stateFile)

  /* 2) Execute model */
  console.log(`Solving scenario "${scenario.name}"`)
  console.log(`Version ${scenario._version}`)
  await walkThroughFakeSteps()
  /* write results */
  const runDir = resolve(scenarioDir, 'runs')
  await fs.ensureDir(runDir)
  const versionId = scenario._version
  const runFile = resolve(runDir, `${versionId}.run.json`)
  /* 3) Output results to `scenarioId.run.json` */
  const output = R.merge({ type: 'ModelOutput', timestamp: Date.now() }, scenario)
  await fs.writeJson(runFile, output)
}

go().catch(e => {
  console.error(err)
  process.exit(-1)
})
