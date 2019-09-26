const { resolvePath } = require('./util')
const path = require('path')

const DEFAULT_TEMPLATE_DIRNAME = 'base'

const PACKAGE_ROOT = path.join(__dirname, '..')
const PACKAGE_TEMPLATES_DIR = resolvePath(PACKAGE_ROOT, 'templates')
const VERSION = require(resolvePath(PACKAGE_ROOT, 'package.json')).version
const templateArgToTemplateDirname = {
  'default': DEFAULT_TEMPLATE_DIRNAME,
  'base': DEFAULT_TEMPLATE_DIRNAME
}
module.exports = {
  PACKAGE_TEMPLATES_DIR,
  VERSION,
  templateArgToTemplateDirname,
  DEFAULT_TEMPLATE_DIRNAME,
  TARGET_PROJECT_LIB_FOLDER_NAME: 'mit-cave'

}
