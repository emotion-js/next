module.exports = {
  testMatch: [
    '<rootDir>/packages/*/__tests__/*.{js,jsx,mjs}',
    '<rootDir>/packages/**/*/__tests__/*.{js,jsx,mjs}'
  ],
  moduleNameMapper: require('lerna-alias').jest(),
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js'
}
