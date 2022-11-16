const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
// import { terser } from 'rollup-plugin-terser'
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const { babel } = require('@rollup/plugin-babel')

const packageJson = require('./package.json') // assert { type: 'json' }

module.exports = [
  {
    input: 'src/use-form.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
        // globals: { react: 'React' }
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named'
        // globals: { react: 'React' }
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      babel({ babelHelpers: 'bundled' })
    ], // , terser()
    external: ['react', 'react-dom']
  }
]
