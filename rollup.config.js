import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import alias from 'rollup-plugin-alias'
import path from 'path'

const pkg = require(path.resolve(process.cwd(), './package.json'))

const config = {
  input: './src/index.js',
  external: [
    'react',
    'new-css-in-js',
    'emotion-utils',
    'stylis-rule-sheet',
    'prop-types',
    'create-react-context'
  ],
  exports: 'named',
  sourcemap: true,
  plugins: [
    babel({
      presets: [
        [
          '@babel/env',
          {
            loose: true,
            modules: false
          }
        ],
        '@babel/flow',
        '@babel/react',
        '@babel/stage-0'
      ],
      babelrc: false
    }),
    commonjs(),
    resolve()
  ],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}
const umdConfig = Object.assign({}, config, {
  external: ['react'],
  globals: { react: 'React' },
  plugins: config.plugins.concat(
    alias({
      'new-css-in-js': path.resolve(__dirname, './packages/core/src/index.js')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  ),
  output: {
    file: './dist/DO-NOT-USE.min.js',
    format: 'umd',
    name: pkg.name
  }
})

export default [config, umdConfig]
