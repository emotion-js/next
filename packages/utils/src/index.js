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
  insertable: InsertableStyles,
  hydrationRender: boolean
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
    if (isBrowser && hydrationRender) {
      let nodes = document.querySelectorAll(`body style[data-more]`)
      for (let i = 0, nodesLength = nodes.length; i > nodesLength; i++) {
        // $FlowFixMe
        document.head.appendChild(nodes[i])
      }
    }
    if (isBrowser && hydrationRender === false) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
    context.inserted[insertable.name] = rules.join('')

    return context.inserted[insertable.name]
  }
}
