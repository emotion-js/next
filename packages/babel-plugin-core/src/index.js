// @flow
import cssMacro, { transformCssCallExpression } from './css-macro'
import styledMacro from './styled-macro'
import { createPlugin } from './create-plugin'
import { addDefault } from '@babel/helper-module-imports'

export const macros = {
  css: cssMacro,
  styled: styledMacro
}

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

export default createPlugin(
  {
    '@emotion/css': cssMacro,
    '@emotion/styled': styledMacro
  },
  babel => {
    let t = babel.types
    return {
      Program(path: *, state: *) {
        if (state.opts.jsx === undefined) {
          for (const node of path.node.body) {
            if (
              t.isModuleDeclaration(node) &&
              node.source.value === '@emotion/jsx'
            ) {
              state.transformCssProp = true
              break
            }
          }
        } else {
          state.transformCssProp = state.opts.jsx
        }
      },
      JSXAttribute(path: *, state: *) {
        if (path.node.name.name !== 'css' && state.transformCssProp) {
          return
        }

        if (
          t.isJSXExpressionContainer(path.node.value) &&
          (t.isObjectExpression(path.node.value.expression) ||
            t.isArrayExpression(path.node.value.expression))
        ) {
          let expressionPath = path.get('value.expression')
          if (expressionPath.isPure()) {
            if (!state.cssIdentifier) {
              state.cssIdentifier = addDefault(path, '@emotion/css', {
                nameHint: 'css'
              })
            }
            expressionPath.replaceWith(
              t.callExpression(t.cloneDeep(state.cssIdentifier), [
                path.node.value.expression
              ])
            )
            transformCssCallExpression({
              babel,
              state,
              path: expressionPath
            })
          }
        }
      }
    }
  }
)
