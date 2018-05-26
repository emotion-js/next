// we're using rollup to avoid the
const config = {
  input: path.resolve(__filename, '..', 'src', 'index.js'),
  external,
  plugins: [
    cjs({
      exclude: [path.join(__dirname, '..', '..', 'packages', '*/src/**/*')]
    }),
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
        'codegen',
        ['@babel/proposal-class-properties', { loose: true }],

        // 'closure-elimination',
        '@babel/plugin-proposal-object-rest-spread'
      ].filter(Boolean),
      babelrc: false
    }),

    isUMD && alias(lernaAliases()),
    isUMD &&
      pkg.dependencies &&
      resolve({ only: Object.keys(pkg.dependencies) }),
    isUMD && replace({ 'process.env.NODE_ENV': '"production"' }),
    isUMD && uglify()
  ].filter(Boolean)
}
