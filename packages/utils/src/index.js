// @flow
import type { CSSCache, CSSContextType, InsertableStyles } from '@emotion/types'

export const isBrowser = typeof document !== 'undefined'
export const shouldSerializeToReactTree =
  !isBrowser || process.env.NODE_ENV === 'test'

export function getRegisteredStyles(
  registered: CSSCache,
  registeredStyles: string[],
  classNames: string
) {
  let rawClassName = ''

  classNames.split(' ').forEach(className => {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className])
    } else {
      rawClassName += `${className} `
    }
  })
  return rawClassName
}

export const insertStyles = (
  context: CSSContextType,
  insertable: InsertableStyles
) => {
  if (
    insertable.type === 1 &&
    context.registered[`css-${insertable.name}`] === undefined
  ) {
    context.registered[`css-${insertable.name}`] = insertable.styles
  }
  if (context.inserted[insertable.name] === undefined) {
    let rules = context.stylis(
      insertable.type === 1 ? `.css-${insertable.name}` : '',
      insertable.styles
    )

    if (shouldSerializeToReactTree) {
      context.inserted[insertable.name] = rules.join('')
    } else {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
      context.inserted[insertable.name] = true
    }
    if (context.compat === undefined) {
      return context.inserted[insertable.name]
    }
  }
}
