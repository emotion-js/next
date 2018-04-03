// @flow
import { createMacro } from 'babel-plugin-macros'
import { addDefault } from '@babel/helper-module-imports'
import {
  getLabelFromPath,
  getExpressionsFromTemplateLiteral
} from '@emotion/babel-utils'

module.exports = createMacro(({ references, state, babel }) => {
  const t = babel.types
  if (references.default.length) {
    let styledIdentifier
    references.default.forEach(reference => {
      if (!styledIdentifier) {
        styledIdentifier = addDefault(reference, '@emotion/styled-base', {
          nameHint: 'styled'
        })
      }
      if (t.isMemberExpression(reference.parent)) {
        reference.parentPath.replaceWith(
          t.callExpression(t.cloneDeep(styledIdentifier), [
            t.stringLiteral(reference.parent.property.name)
          ])
        )
      } else {
        reference.replaceWith(t.cloneDeep(styledIdentifier))
      }
      if (reference.parentPath && reference.parentPath.parentPath) {
        const styledCallPath = reference.parentPath.parentPath
        if (t.isTaggedTemplateExpression(styledCallPath)) {
          const expressions = getExpressionsFromTemplateLiteral(
            styledCallPath.node.quasi,
            t
          )
          styledCallPath.replaceWith(
            t.callExpression(styledCallPath.node.tag, expressions)
          )
        }
      }
      if (t.isCallExpression(reference.parentPath)) {
        reference.parentPath.node.arguments[1] = t.objectExpression([
          t.objectProperty(
            t.identifier('label'),
            t.stringLiteral(getLabelFromPath(reference.parentPath, t))
          )
        ])
      }
    })
  }
})
