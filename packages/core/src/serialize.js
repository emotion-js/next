// @flow
import type { CSSCache } from './types'
import { hashString } from 'emotion-utils'
import { processStyleName, processStyleValue } from './utils'

type Interpolation = any

function handleInterpolation(
  registered: CSSCache | null,
  interpolation: Interpolation
): string | number {
  if (interpolation == null) {
    return ''
  }

  switch (typeof interpolation) {
    case 'boolean':
      return ''
    case 'function':
      return handleInterpolation.call(
        this,
        registered,
        this === undefined
          ? interpolation()
          : // $FlowFixMe
            interpolation(this.mergedProps, this.context)
      )
    case 'object':
      if (interpolation.scope === '') {
        return interpolation.toString()
      }
      if (interpolation.styles !== undefined) {
        return interpolation.styles
      }

      return createStringFromObject.call(this, registered, interpolation)
    default:
      const cached = registered === null ? undefined : registered[interpolation]
      return cached !== undefined ? cached : interpolation
  }
}

function createStringFromObject(
  registered: CSSCache | null,
  obj: { [key: string]: Interpolation }
): string {
  let string = ''

  if (Array.isArray(obj)) {
    obj.forEach(function(interpolation: Interpolation) {
      string += handleInterpolation.call(this, registered, interpolation)
    }, this)
  } else {
    Object.keys(obj).forEach(function(key: string) {
      if (typeof obj[key] !== 'object') {
        if (registered !== null && registered[obj[key]] !== undefined) {
          string += `${key}{${registered[obj[key]]}}`
        } else {
          string += `${processStyleName(key)}:${processStyleValue(
            key,
            obj[key]
          )};`
        }
      } else {
        string += `${key}{${handleInterpolation.call(
          this,
          registered,
          obj[key]
        )}}`
      }
    }, this)
  }

  return string
}

export function createStyles(
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
  let name = hashString(styles) + identifierName

  const ret: Object = {
    styles,
    name,
    scope: `.css-${name}`,
    toString: () => `css-${name}`
  }
  return ret
}

const labelPattern = /label:\s*([^\s;\n{]+)\s*;/g

export const serializeStyles = function(
  registered: CSSCache | null,
  args: Array<Interpolation>
): { styles: string, name: string, scope: string } {
  let styles = ''
  let identifierName = ''
  args.forEach(function(interpolation, i) {
    styles += handleInterpolation.call(this, registered, interpolation)
  }, this)
  styles = styles.replace(labelPattern, (match, p1: string) => {
    identifierName += `-${p1}`
    return ''
  })
  let name = hashString(styles) + identifierName
  return {
    styles,
    name,
    scope: `.css-${name}`,
    toString: () => `css-${name}`
  }
}
