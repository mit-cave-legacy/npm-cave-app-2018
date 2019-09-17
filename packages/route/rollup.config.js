import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import postcss from 'rollup-plugin-postcss'
import url from 'rollup-plugin-url'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const external = ['react', 'react-vis', 'react-dom', 'framework-x', 'react-tooltip', '@mit-cave/ui']
const plugins = [
  peerDepsExternal(),
  postcss({
    modules: true
  }),
  json(),
  url({
    limit: 99999999999 //embed the map
  }),
  resolve({
    preferBuiltins: false,
    // jsnext: true,
    main: true,
    // module: true,
    browser: true
  }),
  commonjs({
    include: [
      /node_modules/
    ],
    exclude: [
      'node_modules/process-es6/**',
      'node_modules/framework-x/**'
    ],
    namedExports: {
      'node_modules/react/index.js': [
        'Children',
        'Component',
        'PureComponent',
        'PropTypes',
        'createElement',
        'Fragment',
        'cloneElement',
        'StrictMode',
        'createFactory',
        'createRef',
        'createContext',
        'isValidElement',
        'isValidElementType'
      ],
      'node_modules/react-dom/index.js': [
        'render',
        'hydrate'
      ]
    }
  }),
  nodeBuiltins(),
  nodeGlobals(),
  babel({
    exclude: /node_modules/,
  })
]

const cjsConfig = {
  input: {
    index: 'src/index.js',
    event: 'src/event.js',
  },
  output: {
    dir: 'dist/cjs',
    format: 'cjs',
    sourceMap: true
  },
  external,
  plugins
}

const esConfig = {
   input: {
    index: 'src/index.js',
    event: 'src/event.js'
  },
  output: [
    {
      dir:'dist/es',
      format: 'es',
      sourceMap: true
    }
  ],
  external,
  plugins
}

export default [cjsConfig, esConfig]
