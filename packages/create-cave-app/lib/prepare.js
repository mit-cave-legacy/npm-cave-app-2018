const fs = require('fs-extra')
const path = require('path')
const {
  MONOREPO_LIBS_DIR,
  MONOREPO_EXAMPLES_DIR,
  PACKAGE_LIBS_DIR,
  PACKAGE_TEMPLATES_DIR,
  DEFAULT_LIBS_DIRNAMES,
  TARGET_PROJECT_LIB_FOLDER_NAME
} = require('./constants')
const { resolvePath, filesOf, dirsOf, copyWithTempdir } = require('./util')


const copyTemplates = () => {
  const excludedPaths = [
    /node_modules/,
    'dist',
    '.cache',
    'examples/base/data',
    'client/src/mit-cave'
  ]
  fs.copySync(MONOREPO_EXAMPLES_DIR, PACKAGE_TEMPLATES_DIR, (src, dest) => {
    if (excludedPaths.some(x => src.match(x))) {
      // console.debug('excluded', src)
      return false
    }
    return true
  })
}

const copyLibs = () => {
  const packagePaths = ['src', 'package.json']
  const packageIncludePaths = DEFAULT_LIBS_DIRNAMES.reduce((a, root) => {
    packagePaths.forEach(path => {
      a.push(root + '/' + path)
    })
    return a
  }, [])
  const packagesInBuild = {
    from: MONOREPO_LIBS_DIR,
    to: PACKAGE_LIBS_DIR,
    pred: (src, dest) => {
      const pathArray = src.split('/')
      const leaf = pathArray[pathArray.length - 1]
      // descend into each package here
      // Including package names in the regex match below would include all paths
      if (new Set([...DEFAULT_LIBS_DIRNAMES, 'packages']).has(leaf)) return true
      return packageIncludePaths.some(p => src.match(p))
    }
  }
  copyWithTempdir(packagesInBuild)
}

const copyLibsIntoTemplates = () => {
  const packageToClientTemplate = (templateDir, packageDir) => ({
    from: resolvePath(MONOREPO_LIBS_DIR, packageDir, 'src'),
    to: resolvePath(PACKAGE_TEMPLATES_DIR, templateDir, 'client', 'src', TARGET_PROJECT_LIB_FOLDER_NAME, packageDir),
    pred: (src, dest) => true
  })


  const templateDirs = dirsOf(PACKAGE_TEMPLATES_DIR)

  templateDirs.forEach(templateDir => {

      DEFAULT_LIBS_DIRNAMES.forEach(
        packageDir => {

          const { from, to, pred } = packageToClientTemplate(templateDir, packageDir)
          copyWithTempdir({
            from,
            to,
            pred,
            onCopy:
              ({ dest, isDirectory }) => {
                if (!isDirectory) return
                const fileNames = filesOf(dest)

                // replace each occurrence of @mit-cave in the published packages we copied
                // with the local alias
                fileNames
                  .map(filename => resolvePath(dest, filename))
                  .forEach(filepath => {
                    let file = fs.readFileSync(filepath).toString()
                    const pattern = new RegExp(`@mit-cave/`, 'g')
                    file = file.replace(pattern, `${TARGET_PROJECT_LIB_FOLDER_NAME}/`)
                    fs.writeFileSync(filepath, file)
                  })
              }
          })
        })

      // write the index file with relative imports after the lib folder is created
      fs.writeFileSync(
        path.join(PACKAGE_TEMPLATES_DIR, `${templateDir}/client/src/${TARGET_PROJECT_LIB_FOLDER_NAME}/index.js`),
        `export * from "./core"
export * from "./data"
export * from "./map"
export * from "./model"
export * from "./pads"
export * from "./route"
export * from "./scenario"
export * from "./session"
export * from "./ui"
export * from "./util"
`)
    }
  )
}

const main = () => {
  copyTemplates()
  copyLibs()
  copyLibsIntoTemplates()
}


main()
