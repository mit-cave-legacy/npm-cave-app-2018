import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import url from 'rollup-plugin-url'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ],
  /* Need to figure out how to bundle react-tooltip */
  external: ['react', 'react-vis', 'react-dom', 'framework-x', 'react-tooltip', 'prop-types'],
  plugins: [
    // peerDepsExternal(),
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
      // main: true,
      // module: true,
      browser: true
    }),
    commonjs({
      include: [
        /node_modules/
      ],
      exclude: [
        'node_modules/process-es6/**',
        'node_modules/core-js',
        /framework-x/,
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
        ],
      }
    }),
    babel({
      exclude: /node_modules/,
      plugins: ['emotion']
    })
  ]
}
