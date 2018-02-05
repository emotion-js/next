// @flow
import { memoize, unitless } from 'emotion-utils'
import type { CSSCache, CSSContextType, InsertableStyles } from './types'

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

export const insertStyles = (
  context: CSSContextType,
  { name, styles, scope }: InsertableStyles
) => {
  if (scope !== '' && context.registered[`css-${name}`] === undefined) {
    context.registered[`css-${name}`] = styles
  }
  if (context.inserted[name] === undefined) {
    let rules = context.stylis(scope, styles)
    context.inserted[name] = rules.join('')
    if (isBrowser) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
  }
  return context.inserted[name]
}

export let hydration = { shouldHydrate: false }

if (isBrowser) {
  hydration.shouldHydrate = !!document.querySelector('[data-more]')
}

if (process.env.NODE_ENV === 'test') {
  // $FlowFixMe
  Object.defineProperty(hydration, 'shouldHydrate', {
    set: () => {},
    get: () => true
  })
}
