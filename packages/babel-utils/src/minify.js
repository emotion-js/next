// @flow

export function getExpressionsFromTemplateLiteral(node: *, t: *): Array<*> {
  const raw = createRawStringFromTemplateLiteral(node)
  const minified = minify(raw)
  return replacePlaceholdersWithExpressions(minified, node.expressions || [], t)
}

const interleave = (strings: Array<*>, interpolations: Array<*>) =>
  interpolations.reduce(
    (array, interp, i) => array.concat([interp], strings[i + 1]),
    [strings[0]]
  )

function getDynamicMatches(str: string) {
  const re = /xxx(\d+)xxx/gm
  let match
  const matches = []
  while ((match = re.exec(str)) !== null) {
    matches.push({
      value: match[0],
      p1: parseInt(match[1], 10),
      index: match.index
    })
  }

  return matches
}

function replacePlaceholdersWithExpressions(
  str: string,
  expressions: Array<*>,
  t: *
) {
  const matches = getDynamicMatches(str)
  if (expressions.length === 0) {
    if (str === '') {
      return []
    }
    return [t.stringLiteral(str)]
  }
  const strings = []
  const finalExpressions = []
  let cursor = 0

  matches.forEach(({ value, p1, index }, i) => {
    const preMatch = str.substring(cursor, index)
    cursor = cursor + preMatch.length + value.length
    if (preMatch) {
      strings.push(t.stringLiteral(preMatch))
    } else if (i === 0) {
      strings.push(t.stringLiteral(''))
    }

    finalExpressions.push(expressions[p1])
    if (i === matches.length - 1) {
      strings.push(t.stringLiteral(str.substring(index + value.length)))
    }
  })

  return interleave(strings, finalExpressions).filter(
    // $FlowFixMe
    (node: StringLiteral) => {
      return node.value !== ''
    }
  )
}

function createRawStringFromTemplateLiteral(quasi: {
  quasis: Array<{ value: { cooked: string } }>
}) {
  let strs = quasi.quasis.map(x => x.value.cooked)

  const src = strs
    .reduce((arr, str, i) => {
      arr.push(str)
      if (i !== strs.length - 1) {
        arr.push(`xxx${i}xxx`)
      }
      return arr
    }, [])
    .join('')
    .trim()
  return src
}

// babel-plugin-styled-components
// https://github.com/styled-components/babel-plugin-styled-components/blob/8d44acc36f067d60d4e09f9c22ff89695bc332d2/src/minify/index.js

const symbolRegex = /(\s*[;:{},]\s*)/g

// Counts occurences of substr inside str
const countOccurences = (str, substr) => str.split(substr).length - 1

const minify = (code: string) =>
  code.split(symbolRegex).reduce((str, fragment, index) => {
    // Even-indices are non-symbol fragments
    if (index % 2 === 0) {
      return str + fragment
    }

    // Only manipulate symbols outside of strings
    if (
      countOccurences(str, "'") % 2 === 0 &&
      countOccurences(str, '"') % 2 === 0
    ) {
      return str + fragment.trim()
    }

    return str + fragment
  }, '')
