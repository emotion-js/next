// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler

const delimiter = '/*|*/'
const needle = delimiter + '}'

export default function createRuleSheetPlugin(insertRule) {
  function toSheet(block) {
    if (block) {
      insertRule(block + '}')
    }
  }

  return function ruleSheet(
    context,
    content,
    selectors,
    parents,
    line,
    column,
    length,
    at,
    depth
  ) {
    switch (context) {
      // property
      case 1: {
        // @import
        if (depth === 0 && content.charCodeAt(0) === 64) {
          insertRule(content + ';')
          return ''
        }
        break
      }
      // selector
      case 2: {
        if (ns === 0) {
          return content + delimiter
        }
        break
      }
      // at-rule
      case 3: {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            insertRule(selectors[0] + content)
            return ''
          default:
            return content + (at === 0 ? delimiter : '')
        }
      }
      case -2: {
        content.split(needle).forEach(toSheet)
      }
    }
  }
}
