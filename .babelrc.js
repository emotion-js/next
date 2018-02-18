module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        exclude: ['transform-typeof-symbol']
      }
    ],
    '@babel/react',
    '@babel/flow'
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    require('./scripts/build/add-basic-constructor-to-react-component'),
    'codegen',
    'closure-elimination',
    ['@babel/proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
