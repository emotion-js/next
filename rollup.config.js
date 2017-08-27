import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const config = {
  input: './src/index.js',
  sourcemap: true,
  external: ['react'],
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

export default config
