const svgToJsx = require('svg-to-jsx')
const clipboardy = require('clipboardy')
const { writeFile, pathExists } = require('fs-extra')
const v = require('voca')
const path = require('path')

const go = async name => {
  const svg = await clipboardy.read()
  if (!svg) throw new Error('SVG should be in clipboard')
  const jsx = await svgToJsx(svg)
  const final = `import React from 'react'
import { SvgIcon } from './SvgIcon'    

export class ${v.titleCase(name)} extends React.PureComponent {
  render() {
    const { color = '#FFF', ...props } = this.props
    return (
      ${jsx.replace('<svg', '<SvgIcon').replace('</svg>', '</SvgIcon>')}
    )
  }
}`
  const outPath = path.resolve('./src/ui/icons', `${v.titleCase(name)}.js`)
  // if (await pathExists(outPath)) throw new Error('File already exists.')
  await writeFile(outPath, final)
}

const name = process.argv[2]
if (!name) {
  console.warn('No name specified.')
  process.exit(-1)
}
go(name, name)
  .then(() => 'done.')
  .catch(err => console.error(err))
