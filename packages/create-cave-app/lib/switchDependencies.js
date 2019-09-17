const fs = require('fs-extra')
const path = require('path')
const parser = require('@babel/parser')
const generator = require('@babel/generator')
const { TARGET_PROJECT_LIB_FOLDER_NAME } = require('./constants')

const supportedLibs = new Set([
  '@mit-cave/core',
  '@mit-cave/data',
  '@mit-cave/map',
  '@mit-cave/model',
  '@mit-cave/pads',
  '@mit-cave/route',
  '@mit-cave/scenario',
  '@mit-cave/session',
  '@mit-cave/util'
])

const isRelPathSyntax = str => ~str.indexOf('./')
const getEjectTo = (pkgName) => './' + pkgName.split('/')[1]

const validateArgs = ({ libsToInject }) => {
  const canInject = libsToInject.filter(lib => supportedLibs.has(lib))
  if (canInject.length !== libsToInject.length) {
    const injectable = new Set(canInject)
    const invalidLibs = libsToInject.filter(lib => !injectable.has(lib))
    console.error(`Replacing ${JSON.stringify(invalidLibs)} is not supported. \n\nSupported  libs: ${JSON.stringify(Array.from(supportedLibs), null, 2)}`)
    process.exit(1)
  }
  return true
}

const removeFromPackageJSON = (pkgJson, libNames) => {
  let ret = Object.assign({}, pkgJson)
  const deps = Object.assign({}, pkgJson.dependencies)
  const devDeps = Object.assign({}, pkgJson.devDependencies)
  let removed = []
  libNames.forEach(name => {
    if (pkgJson.dependencies[name]) {
      console.log(`Removing ${name} from package.json "dependencies"`)
      delete ret.dependencies[name]
      removed.push({ name, version: deps[name] })
    }
    if (pkgJson.devDependencies[name]) {
      console.log(`Removing ${name} from package.json "devDependencies"`)
      delete ret.devDependencies[name]
      removed.push({ name, version: devDeps[name], dev: true })
    }
  })
  return { packageJSON: ret, removed }
}

const getPackageJSON = projectRoot => require(path.join(projectRoot, 'package.json'))

const writePackageJSON = (packageJSON, path) => {
  fs.writeFileSync(path, JSON.stringify(packageJSON, null, 2))
}

const getAST = (filepath) => {
  const source = fs.readFileSync(filepath).toString()
  return parser.parse(source, {
    allowImportExportEverywhere: true,
    exportNamespaceForm: true
  })
}

const validateRequestedLibsAreImported = (ast, requestedSet) => {
  let foundSet = new Set()
  ast.program.body.forEach(node => {
    if (node.type === 'ExportAllDeclaration' && requestedSet.has(node.source.value)) {
      console.log('found', node)
      foundSet.add(node.source.value)
    }
  })
  if (foundSet.size !== requestedSet.size) {
    const missing = Array.from(requestedSet).filter(req => !foundSet.has(req))
    console.error(`missing 'export * from' declarations for ${missing}`)
    process.exit(0)
  }
  console.log(foundSet, requestedSet)
}

const updateASTWithLocalPaths = (ast, libsToInjectSet) => {
  let replacedNamesToRelPaths = {}
  ast.program.body.forEach(node => {
    if (node.type === 'ExportAllDeclaration' && libsToInjectSet.has(node.source.value)) {
      const relPath = getEjectTo(node.source.value)
      replacedNamesToRelPaths[node.source.value] = relPath
      node.source.value = relPath
    }
  })
  return replacedNamesToRelPaths
}

const getReplacementSummary = (replacedMap, projectRoot) => {
  return Object.entries(replacedMap).reduce((a, [libName, relPath]) => {
    a.push({
      name: libName,
      absolutePath: path.join(projectRoot, 'src', TARGET_PROJECT_LIB_FOLDER_NAME, relPath),
      importPath: relPath
    })
    return a
  }, [])
}

const writeASTToFile = (ast, filepath) => {
  const output = generator.default(ast)
  fs.writeFileSync(filepath, output.code.replace(/;/g, ''))
}

const updateIndexFile = (indexFile, libNames, projectRoot) => {
  const ast = getAST(indexFile)
  const libsToInjecttSet = new Set(libNames)

  validateRequestedLibsAreImported(ast, libsToInjecttSet)

  const replacedMap = updateASTWithLocalPaths(ast, libsToInjecttSet)

  writeASTToFile(ast,
    // fixme. uncomment when done testing
    // indexFile,
    'output-test.js'
  )

  return getReplacementSummary(replacedMap, projectRoot)
}

const switchPublishedToLocal = ({ libNames, projectRoot, indexFile }) => {
  validateArgs({ libsToInject: libNames })

  const replacedInIndex = updateIndexFile(indexFile, libNames, projectRoot)

  const {
    packageJSON: updatedPackageJSON,
    removed
  } =
    removeFromPackageJSON(
      getPackageJSON(projectRoot),
      replacedInIndex.map(x => x.name)
    )

  console.log('up', updatedPackageJSON, replacedInIndex, removed)
  // writePackageJSON(updatedPackageJSON, projectRoot)

}


module.exports = {
  switchPublishedToLocal
}
