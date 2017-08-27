module.exports = {"extends": [
  "standard",
  "standard-react",
  "prettier",
  "prettier/react"
],
"plugins": [
  "prettier"
],
"parser": "babel-eslint",
"rules": {
  "prettier/prettier": [
    "error",
    {
      "singleQuote": true,
      "semi": false
    }
  ],
  "react/prop-types": 0,
  "react/no-unused-prop-types": 0,
  "standard/computed-property-even-spacing": 0,
  "no-template-curly-in-string": 0
},
"overrides": [
  {
    "files": [
      "*.test.js",
      "__tests__/*"
    ],
    "env": {
      "jest": true
    }
  }
]}