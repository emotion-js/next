// @flow
import { createMacro } from 'babel-plugin-macros'
import { addDefault } from '@babel/helper-module-imports'
import {
  getLabelFromPath,
  getExpressionsFromTemplateLiteral
} from '@emotion/babel-utils'

export const appendStringToExpressions = (
  expressions: Array<*>,
  string: string,
  t: *
) => {
  if (!string) {
    return expressions
  }
  if (t.isStringLiteral(expressions[expressions.length - 1])) {
    expressions[expressions.length - 1].value += string
  } else {
    expressions.push(t.stringLiteral(string))
  }
  return expressions
}

export const transformCssCallExpression = ({ babel, state, path }: *) => {
  let t = babel.types
  if (t.isTaggedTemplateExpression(path)) {
    const expressions = getExpressionsFromTemplateLiteral(path.node.quasi, t)
    path.replaceWith(t.callExpression(path.node.tag, expressions))
  }

  if (t.isCallExpression(path)) {
    const label = getLabelFromPath(path, t)
    if (label) {
      appendStringToExpressions(path.node.arguments, `label:${label};`, t)
    }

    let isPure = true

    path.get('arguments').forEach(node => {
      if (!node.isPure()) {
        isPure = false
      }
    })

    if (isPure) {
      path.hoist()
    }
  }
}

export default createMacro(({ references, state, babel }) => {
  const t = babel.types
  if (references.default.length) {
    references.default.reverse().forEach(reference => {
      if (!state.cssIdentifier) {
        state.cssIdentifier = addDefault(reference, '@emotion/css', {
          nameHint: 'css'
        })
      }
      reference.replaceWith(t.cloneDeep(state.cssIdentifier))
      transformCssCallExpression({ babel, state, path: reference.parentPath })
    })
  }
})
