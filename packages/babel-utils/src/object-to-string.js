// @flow
import unitless from '@emotion/unitless'

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
    let value
    if (t.isNumericLiteral(property.value)) {
      if (unitless[key] !== 1 && property.value.value !== 0) {
        value = property.value.value + 'px'
      } else {
        value = property.value.value
      }
    } else {
      value = property.value.value
    }
    finalString += `${key}:${value};`
  })
  return bailout ? node : t.stringLiteral(finalString)
}
