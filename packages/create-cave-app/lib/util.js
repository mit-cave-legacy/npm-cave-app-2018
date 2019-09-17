const fs = require('fs-extra')
const { resolve, join } = require('path')


const resolvePath = (...paths) => resolve(join(...paths))

const dirsOf = (path) => {
  return fs.readdirSync(path)
           .filter(name => fs.statSync(resolvePath(path, name)).isDirectory())
}
const filesOf = (path) => {
  return fs.readdirSync(path)
           .filter(name => fs.statSync(resolvePath(path, name)).isDirectory()===false)
}

const copyWithTempdir = ({ from, to, pred, onCopy }) => {
  const tempPath = resolvePath(__dirname, './../../../.create-cave-app')
  fs.ensureDirSync(tempPath)
  fs.copySync(from, tempPath, pred)
  fs.ensureDirSync(to)
  fs.moveSync(tempPath, to, { overwrite: true })
  fs.removeSync(tempPath)
  if (onCopy) {
    onCopy({
      dest: to,
      isDirectory: fs.statSync(resolvePath(to)).isDirectory()
    })
  }
}

module.exports = {
  copyWithTempdir,
  dirsOf,
  filesOf,
  resolvePath
}
