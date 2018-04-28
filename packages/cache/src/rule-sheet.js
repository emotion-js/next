// @flow
/* eslint-disable no-fallthrough */
// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler

const delimiter = '/*|*/'
const needle = delimiter + '}'

function toSheet(block) {
  if (block) {
    current.push(block + '}')
  }
}

function ruleSheet(
  context: -2 | -1 | 0 | 1 | 2 | 3,
  content: string,
  selectors: Array<string>,
  parents: Array<string>,
  line: number,
  column: number,
  length: number,
  at: number,
  depth: number
) {
  switch (context) {
    case -1: {
      current = []
    }
    case 2:
      if (at === 0) return content + delimiter
      break
    // at-rule
    case 3:
      switch (at) {
        // @font-face, @page
        case 102:
        case 112: {
          current.push(selectors[0] + content)
          return ''
        }
        default: {
          return content + delimiter
        }
      }
    case -2: {
      content.split(needle).forEach(toSheet)
      return current
    }
  }
}

let current

export default ruleSheet
