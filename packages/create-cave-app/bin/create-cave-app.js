#!/usr/bin/env node
const exec = require('child_process').execSync
const path = require('path')
const fs = require('fs-extra')
// const { switchPublishedToLocal } = require('../lib/switchDependencies')
const {
  PACKAGE_TEMPLATES_DIR,
  TARGET_PROJECT_LIB_FOLDER_NAME,
  DEFAULT_TEMPLATE_DIRNAME,
  VERSION,
  templateArgToTemplateDirname
} = require('./../lib/runtimeConstants')


const UPGRADEABLE_DEPS = ['cave-app']
const COMMAND_DIR = process.cwd()

const indent = ' '.repeat(4)
const print = str => console.log(indent + str)

const datafyFlags = (xs) => xs.reduce((a, b) => {
  if (b.startsWith('--')) {
    const sepIdx = b.indexOf('=')
    const hasValue = sepIdx > 0
    const key = b.slice(2, hasValue ? sepIdx : b.length)
    const value = hasValue ? b.slice(sepIdx + 1) : true
    a[key] = value
    return a
  }
  return a
}, {})

const startTemplate = ([projectName, ...rest]) => {
  if (!projectName) {
    console.error(`Project name is required. E.g. create-cave-app new hello-world `)
    process.exit(1)
  }

  const args = datafyFlags(rest)

  if (args.hasOwnProperty('template')
      && !templateArgToTemplateDirname[args['template']]) {
    console.error(`Unknown template "${args['template']}"`)
    console.error(`Currently supported templates:`, options.new.template)
    process.exit(1)
  }
  const templateName = args['template'] || 'default'
  const templateDir = templateArgToTemplateDirname[templateName]
  const projectPath = path.resolve(projectName)
  try {
    fs.copySync(PACKAGE_TEMPLATES_DIR + '/' + templateDir, projectName)
  } catch (e) {
    console.error(`We couldn't access ${projectPath}. Try creating the directory and ensuring write permissions.`)
    process.exit(1)
  }

  [{
    name: projectName,
    nameSuffix: '',
    path: projectPath,
    packageJsonPath: projectPath + '/package.json'
  }, {
    name: projectName,
    nameSuffix: '-client',
    path: projectPath + '/client'
  }, {
    name: projectName,
    nameSuffix: '-server',
    path: projectPath + '/server'
  }].map(({ name, nameSuffix, path }) => {
    const fullName = name + nameSuffix

    const packageJSONPath = path + '/package.json'
    const p = require(packageJSONPath)
    p.name = fullName
    fs.writeFileSync(packageJSONPath, JSON.stringify(p, null, 2))

    const rmPath = path + '/README.md'
    const rm = fs.readFileSync(rmPath).toString()
    fs.writeFileSync(rmPath, '# ' + fullName + rm.slice(rm.indexOf('\n')))
  })


  console.log(`Created new cave-app in ${projectPath}`)
  process.exit(0)
}

const upgradeDeps = () => {
  try {
    exec('cd client', { stdio: 'ignore' })
  } catch (e) {
    console.log(`Couldn't find "client" folder.`)
    console.log('Please use "update" from a CAVE app root folder with a client app folder named "client".')
    process.exit(1)
  }
  console.log('Ensuring the following dependencies are up to date: ' + UPGRADEABLE_DEPS)
  exec('cd client && npm upgrade ' + UPGRADEABLE_DEPS.join(' '))
  process.exit(0)
}

const tryFindUserCaveLibIndex = (rootFolder) => {
  const indexPath = path.join(rootFolder, `src/${TARGET_PROJECT_LIB_FOLDER_NAME}/index.js`)
  if (fs.pathExistsSync(indexPath)) {
    return indexPath
  }
  console.error(`Expected an index.js file with cave-lib exports at ${indexPath}`)
  process.exit(1)

}
const useSource = (args) => {
  const indexFile = tryFindUserCaveLibIndex(COMMAND_DIR)
  const projectRoot = indexFile.slice(0, indexFile.indexOf(`src/${TARGET_PROJECT_LIB_FOLDER_NAME}`))
  // switchPublishedToLocal({ libNames: args, projectRoot, indexFile })

  process.exit(0)
}

const help = {
  main: () => {
    console.log('create-cave-app ' + VERSION)
    console.log(`Usage: create-cave-app <command>\n`)
    console.log('  Commands:')
    print('new - Creates a new CAVE project from the template')
    // print('upgrade - Upgrades dependencies for an existing CAVE project')
    print('')
  },
  'new': () => {
    print('Usage: create-cave-app new <project-name>')
    print('options: ')
    print('  --template=<template-name>')
    print(`Where <template-name> is one of ${JSON.stringify(Object.keys(templateArgToTemplateDirname)
                                                                  .filter(n => n
                                                                               !== 'default'))}`)
    print(`default: "${DEFAULT_TEMPLATE_DIRNAME}"`)
  }
}

const commands = {
  'new': (xs) => startTemplate(xs),
  // 'use-source': (xs) => useSource(xs),
  // 'upgrade': (xs) => upgradeDeps(xs),
  'help': (xs) => {
    if (xs.length === 0) {
      help.main()
    }
    const cmd = xs[0]
    if (help[cmd]) {
      help[cmd]()
    } else {
      help.main()
    }
  },
  'version': () => {
    console.log(VERSION)
  }
}
const options = {
  'new': {
    template: Object.keys(templateArgToTemplateDirname)
  }
}

const [, , ...args] = process.argv

const [requestedCommand] = args

const command = commands[requestedCommand]


if (!command) {
  if (command !== undefined) {
    print(`I don't know that command yet: "${requestedCommand}`)
    console.log('')
  }
  help.main()

  process.exit(1)
}

command(args.slice(1))

