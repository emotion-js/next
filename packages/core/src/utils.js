// @flow
import { memoize, unitless } from 'emotion-utils'
import type { CSSCache, CSSContextType } from './types'

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

export const isBrowser = typeof window !== 'undefined'

export function getRegisteredStyles(
  registered: CSSCache,
  registeredStyles: string[],
  classNames: string
) {
  let rawClassName = ''

  classNames.split(' ').forEach(className => {
    if (registered[className] !== undefined) {
      registeredStyles.push(className)
    } else {
      rawClassName += `${className} `
    }
  })
  return rawClassName
}

export const scoped = (
  context: CSSContextType,
  { name, styles }: { name: string, styles: string }
) => {
  let cls = `css-${name}`
  if (context.registered[cls] === undefined) {
    context.registered[cls] = styles
  }
  if (context.inserted[name] === undefined) {
    let rules = context.stylis(`.${cls}`, styles)
    context.inserted[name] = rules.join('')
    if (isBrowser) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
  }
  return cls
}
