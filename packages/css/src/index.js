// @flow
import type { Interpolation, ScopedInsertableStyles } from '@emotion/types'
import hashString from '@emotion/hash'
import { handleInterpolation, labelPattern } from '@emotion/serialize'

function css(
  strings: Interpolation | string[],
  ...interpolations: Interpolation[]
): ScopedInsertableStyles {
  let stringMode = true
  let styles: string = ''
  let identifierName = ''

  if (strings == null || strings.raw === undefined) {
    stringMode = false
    styles += handleInterpolation.call(this, strings)
  } else {
    styles += strings[0]
  }

  interpolations.forEach(function(interpolation, i) {
    styles += handleInterpolation.call(this, interpolation)
    if (stringMode === true && strings[i + 1] !== undefined) {
      styles += strings[i + 1]
    }
  }, this)
  styles = styles.replace(labelPattern, (match, p1: string) => {
    identifierName += `-${p1}`
    return ''
  })
  let name = hashString(styles) + identifierName

  return {
    type: 1,
    name,
    styles
  }
}

export default css
