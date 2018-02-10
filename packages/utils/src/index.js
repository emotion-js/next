// @flow
import type { CSSCache, CSSContextType, InsertableStyles } from '@emotion/types'

export const isBrowser = typeof document !== 'undefined'

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
    context.inserted[insertable.name] = rules.join('')
    if (isBrowser) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
    return context.inserted[insertable.name]
  }
}
