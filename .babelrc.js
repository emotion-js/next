module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        exclude: ['transform-typeof-symbol']
      }
    ],
    '@babel/preset-react',
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    require('./scripts/build/add-basic-constructor-to-react-component'),
    require('./scripts/build/fix-dce-for-classes-with-statics'),
    'codegen',
    // 'closure-elimination',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
