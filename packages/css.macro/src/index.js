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
    let cssIdentifier
    references.default.reverse().forEach(reference => {
      if (!cssIdentifier) {
        cssIdentifier = addDefault(reference, '@emotion/css', {
          nameHint: 'css'
        })
      }
      reference.replaceWith(t.cloneDeep(cssIdentifier))

      if (t.isTaggedTemplateExpression(reference.parent)) {
        const expressions = getExpressionsFromTemplateLiteral(
          reference.parent.quasi,
          t
        )
        reference.parentPath.replaceWith(
          t.callExpression(reference.parent.tag, expressions)
        )
      }

      if (t.isCallExpression(reference.parentPath)) {
        const label = getLabelFromPath(reference, t)
        if (label) {
          reference.parentPath.node.arguments.push(
            t.stringLiteral(`label:${label};`)
          )
        }

        let isPure = true

        reference.parentPath.get('arguments').forEach(node => {
          if (!node.isPure()) {
            isPure = false
          }
        })

        if (isPure) {
          reference.parentPath.hoist()
        }
      }
    })
  }
})
