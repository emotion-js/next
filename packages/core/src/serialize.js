// @flow
import type { CSSCache } from './types'
import { hashString } from 'emotion-utils'
import { processStyleName, processStyleValue } from './utils'

type Interpolation = any

function handleInterpolation(
  registered: CSSCache,
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
      return createStringFromObject.call(this, registered, interpolation)
    default:
      const cached = registered[interpolation]
      return cached !== undefined ? cached : interpolation
  }
}

function createStringFromObject(
  registered: CSSCache,
  obj: { [key: string]: Interpolation }
): string {
  let string = ''

  if (Array.isArray(obj)) {
    obj.forEach(function(interpolation: Interpolation) {
      string += handleInterpolation.call(this, interpolation, false)
    }, this)
  } else {
    console.log(obj)
    Object.keys(obj).forEach(function(key: string) {
      if (typeof obj[key] !== 'object') {
        console.log(key)
        if (registered[obj[key]] !== undefined) {
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

const labelPattern = /label:\s*([^\s;\n{]+)\s*;/g

export const serializeStyles = function(
  registered: CSSCache,
  args: Array<Interpolation>
): { styles: string, name: string } {
  let styles = ''
  let identifierName = ''
  args.forEach(function(interpolation, i) {
    styles += handleInterpolation.call(this, registered, interpolation)
  }, this)
  styles = styles.replace(labelPattern, (match, p1: string) => {
    identifierName += `-${p1}`
    return ''
  })
  let name = hashString(styles + identifierName) + identifierName
  return { styles, name }
}
