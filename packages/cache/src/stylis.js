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

const replaceCustomLabelSelectors = function (context, content, selector){
  if (context === 2) {
    selector.forEach((stanza, index) => {
      if (/\.css-/.exec(stanza)) {
        throw new Error('Can not target .css- classes with custom styles');
      }

      // If we start with a tag selector (sans any classes), replace with
      // a scoped css class. this is the least impact on the specificity
      // and avoids creating unnecessary class names on the generated
      // markup.
      const replace = stanza
        // And allow for :article selector to target all content in article,
        // including widget internals. This should be considered
        // an undocumented feature vs. a tool we should commonly use.
        .replace(/^(:[A-Z0-9\-_]+)\(([^)]+)\)/g, '.article-body $1');

      console.log(stanza,replace)
    });
  }
}

const returnFullPlugin = function(context) {
  if (context === -1) {
    current = []
  }
  if (context === -2) {
    return current
  }
}


stylis.use(insertionPlugin)(replaceCustomLabelSelectors)(returnFullPlugin)

export default stylis
