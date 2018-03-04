// @flow
import { createMacro } from 'babel-plugin-macros'
import { addDefault } from '@babel/helper-module-imports'

module.exports = createMacro(({ references, state, babel }) => {
  const t = babel.types
  if (references.default.length) {
    references.default.forEach(reference => {
      reference.replaceWith(
        addDefault(reference, '@emotion/css', {
          nameHint: 'css'
        })
      )

      if (
        t.isCallExpression(reference.parent) ||
        t.isTaggedTemplateExpression(reference.parent)
      ) {
        let isPure = true

        if (t.isCallExpression(reference.parent)) {
          reference.parentPath.get('arguments').forEach(node => {
            if (!node.isPure()) {
              isPure = false
            }
          })
        }
        if (t.isTaggedTemplateExpression(reference.parent)) {
          reference.parentPath.get('quasi.expressions').forEach(node => {
            if (!node.isPure()) {
              isPure = false
            }
          })
        }
        if (isPure) {
          reference.parentPath.hoist()
        }
      }
    })
  }
})
