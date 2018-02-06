// @flow
import type { CSSCache, Interpolation } from './types'
import { hashString } from 'emotion-utils'
import { handleInterpolation, labelPattern } from './serialize'

export function css(
  strings: Interpolation | string[],
  ...interpolations: Interpolation[]
) {
  let stringMode = true
  let styles: string = ''
  let identifierName = ''

  if (strings == null || strings.raw === undefined) {
    stringMode = false
    styles += handleInterpolation.call(this, null, strings)
  } else {
    styles += strings[0]
  }

  interpolations.forEach(function(interpolation, i) {
    styles += handleInterpolation.call(this, null, interpolation)
    if (stringMode === true && strings[i + 1] !== undefined) {
      styles += strings[i + 1]
    }
  }, this)
  styles = styles.replace(labelPattern, (match, p1: string) => {
    identifierName += `-${p1}`
    return ''
  })
  let name

  const ret: Object = {
    styles,
    get name() {
      if (name === undefined) {
        name = hashString(styles) + identifierName
      }
      return name
    },
    get scope() {
      if (name === undefined) {
        name = hashString(styles) + identifierName
      }
      return `.css-${name}`
    },
    toString: () => {
      if (name === undefined) {
        name = hashString(styles) + identifierName
      }
      return `css-${name}`
    }
  }
  return ret
}
