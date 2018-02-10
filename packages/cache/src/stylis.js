// @flow
import { Stylis } from 'emotion-utils'
import stylisRuleSheet from './rule-sheet'

const stylis = new Stylis({
  keyframe: false,
  global: false,
  semicolon: true
})

let current

const insertionPlugin = stylisRuleSheet(function(rule: string) {
  current.push(rule)
})

const returnFullPlugin = function(context) {
  if (context === -1) {
    current = []
  }
  if (context === -2) {
    return current
  }
}

stylis.use(insertionPlugin)(returnFullPlugin)

export default stylis
