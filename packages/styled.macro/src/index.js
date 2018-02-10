// @flow
import { createMacro } from 'babel-plugin-macros'
import { addDefault } from '@babel/helper-module-imports'

module.exports = createMacro(({ references, state, babel }) => {
  const t = babel.types
  if (references.default.length) {
    references.default.forEach(reference => {
      if (t.isMemberExpression(reference.parent)) {
        const styledIdentifier = addDefault(reference, '@emotion/styled-base', {
          nameHint: 'styled'
        })
        reference.parentPath.replaceWith(
          t.callExpression(styledIdentifier, [
            t.stringLiteral(reference.parent.property.name)
          ])
        )
      } else {
        reference.replaceWith(
          addDefault(reference, '@emotion/styled-base', {
            nameHint: 'styled'
          })
        )
      }
    })
  }
})
