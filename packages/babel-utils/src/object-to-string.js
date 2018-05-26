// @flow
import { handleInterpolation } from '@emotion/serialize'

export function simplifyObject(node: *, t: *) {
  let bailout = false
  let finalString = ''
  node.properties.forEach(property => {
    if (bailout) {
      return
    }
    if (
      property.computed ||
      (!t.isIdentifier(property.key) && !t.isStringLiteral(property.key)) ||
      (!t.isStringLiteral(property.value) &&
        !t.isNumericLiteral(property.value))
    ) {
      bailout = true
    }
    let key = property.key.name || property.key.value
    if (key === 'styles') {
      bailout = true
      return
    }
    let value = property.value.value

    finalString += handleInterpolation({}, { [key]: value })
  })
  return bailout ? node : t.stringLiteral(finalString)
}
