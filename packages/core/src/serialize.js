// @flow
import type { CSSCache, Interpolation, ScopedInsertableStyles } from './types'
import { hashString } from 'emotion-utils'
import { processStyleName, processStyleValue } from './utils'

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
        interpolation(this.mergedProps, this.context)
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
