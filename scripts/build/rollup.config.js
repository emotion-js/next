// const resolve = require('rollup-plugin-node-resolve')
// const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')
// const alias = require('rollup-plugin-alias')
const cjs = require('rollup-plugin-commonjs')
const path = require('path')
// const lernaAliases = require('lerna-alias').rollup

module.exports = data => {
  const { pkg } = data
  const external = []
  if (pkg.peerDependencies) {
    external.push(...Object.keys(pkg.peerDependencies))
  }
  if (pkg.dependencies) {
    external.push(...Object.keys(pkg.dependencies))
  }

  const config = {
    input: path.resolve(data.path, 'src', 'index.js'),
    external,
    plugins: [
      cjs({
        exclude: [path.join(__dirname, '..', '..', 'packages', '*/src/**/*')]
      }),
      // resolve(),
      babel({
        presets: [
          [
            '@babel/env',
            {
              loose: true,
              modules: false,
              exclude: ['transform-typeof-symbol']
            }
          ],
          '@babel/react',
          '@babel/flow'
        ],
        plugins: [
          '@babel/plugin-transform-flow-strip-types',
          require('./add-basic-constructor-to-react-component'),
          'codegen',
          'closure-elimination',
          ['@babel/proposal-class-properties', { loose: true }],
          '@babel/plugin-proposal-object-rest-spread'
        ],
        babelrc: false
      })
    ]
  }

  return config
}
