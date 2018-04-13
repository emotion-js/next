// @flow
import type { Interpolation, ScopedInsertableStyles } from '@emotion/types'
import { hashString, memoize, unitless } from 'emotion-utils'

const hyphenateRegex = /[A-Z]|^ms/g

export const processStyleName: (styleName: string) => string = memoize(
  (styleName: string) => styleName.replace(hyphenateRegex, '-$&').toLowerCase()
)

export const processStyleValue = (key: string, value: string): string => {
  if (value == null || typeof value === 'boolean') {
    return ''
  }

  if (
    unitless[key] !== 1 &&
    key.charCodeAt(1) !== 45 && // custom properties
    !isNaN(value) &&
    value !== 0
  ) {
    return value + 'px'
  }
  return value
}

export function handleInterpolation(
  interpolation: Interpolation
): string | number {
  if (interpolation == null) {
    return ''
  }

  switch (typeof interpolation) {
    case 'boolean':
      return ''
    case 'function':
      if (this === undefined) {
        return interpolation.toString()
      }
      return handleInterpolation.call(
        this,
        // $FlowFixMe
        interpolation(this)
      )
    case 'object':
      if (interpolation.type === 2) {
        return interpolation.toString()
      }
      if (interpolation.styles !== undefined) {
        return interpolation.styles
      }

      return createStringFromObject.call(this, interpolation)
    default:
      return interpolation
  }
}

function createStringFromObject(obj: { [key: string]: Interpolation }): string {
  let string = ''

  if (Array.isArray(obj)) {
    obj.forEach(function(interpolation: Interpolation) {
      string += handleInterpolation.call(this, interpolation)
    }, this)
  } else {
    Object.keys(obj).forEach(function(key: string) {
      if (typeof obj[key] !== 'object') {
        string += `${processStyleName(key)}:${processStyleValue(
          key,
          obj[key]
        )};`
      } else {
        string += `${key}{${handleInterpolation.call(this, obj[key])}}`
      }
    }, this)
  }

  return string
}

export const labelPattern = /label:\s*([^\s;\n{]+)\s*;/g

export const serializeStyles = function(
  args: Array<Interpolation>
): ScopedInsertableStyles {
  if (
    args.length === 1 &&
    typeof args[0] === 'object' &&
    args[0] !== null &&
    args[0].cls !== undefined
  ) {
    return args[0]
  }
  let styles = ''
  let identifierName = ''
  args.forEach(function(interpolation, i) {
    styles += handleInterpolation.call(this, interpolation)
  }, this)
  styles = styles.replace(labelPattern, (match, p1: string) => {
    identifierName += `-${p1}`
    return ''
  })
  let name = hashString(styles) + identifierName
  return {
    styles,
    name,
    type: 1,
    cls: `css-${name}`
  }
}
