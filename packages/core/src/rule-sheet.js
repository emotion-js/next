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
      case 2:
        if (at === 0) return content + delimiter
        break
      // at-rule
      case 3:
        switch (at) {
          // @font-face, @page
          case 102:
          case 112: {
            insertRule(selectors[0] + content)
            return ''
          }
          default: {
            return content + delimiter
          }
        }
      case -2: {
        content.split(needle).forEach(toSheet)
      }
    }
  }
}
