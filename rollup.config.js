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
  external: ['react', 'new-css-in-js', 'stylis'],
  exports: 'named',
  sourcemap: true,
  plugins: [
    commonjs(),
    resolve(),
    babel({
      presets: [
        [
          'env',
          {
            loose: true,
            modules: false,
            exclude: ['transform-es2015-typeof-symbol']
          }
        ],
        'flow'
      ],
      babelrc: false
    })
  ],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}

if (process.env.UMD) {
  config.external = ['react']
  config.globals = { react: 'React' }
  config.plugins.push(
    alias({
      'new-css-in-js': path.resolve(__dirname, './packages/core/src/index.js')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  )
  config.output = [
    {
      file: './dist/DO-NOT-USE.min.js',
      format: 'umd',
      name: pkg.name
    }
  ]
}

if (pkg.name === 'preact-new-css-in-js') {
  config.input = '../react/src/index.js'
  config.external = ['preact', 'new-css-in-js']
  config.plugins.unshift(alias({ react: 'preact' }))
}

export default config
