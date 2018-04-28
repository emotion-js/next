// @flow
import { StyleSheet } from '@emotion/sheet'
import { isBrowser } from '@emotion/utils'
import type { CSSContextType } from '@emotion/types'
import Stylis from '@emotion/stylis'
import ruleSheetPlugin from './rule-sheet'

export type PrefixOption =
  | boolean
  | ((key: string, value: string, context: 1 | 2 | 3) => boolean)

type StylisPlugins = Function[] | null | Function

export type Options = {
  nonce?: string,
  stylisPlugins?: StylisPlugins,
  prefix?: PrefixOption,
  key?: string,
  container?: HTMLElement
}

const createCache = (options?: Options): CSSContextType => {
  if (options === undefined) options = { key: 'css' }
  let stylisOptions
  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(options.key)) {
      throw new Error(
        `Emotion key must only contain lower case alphabetical characters and - but "${
          // $FlowFixMe
          options.key
        }" was passed`
      )
    }
  }
  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    }
  }

  let stylis = new Stylis(stylisOptions)

  stylis.use(options.stylisPlugins)(ruleSheetPlugin)

  let inserted = {}

  if (isBrowser) {
    const nodes = document.querySelectorAll(
      // $FlowFixMe
      `style[data-emotion-${options.key}]`
    )

    Array.prototype.forEach.call(nodes, (node: HTMLStyleElement) => {
      // $FlowFixMe
      const attrib = node.getAttribute(`data-emotion-${options.key}`)
      // $FlowFixMe
      attrib.split(' ').forEach(id => {
        inserted[id] = true
      })
      // $FlowFixMe
      let parent = options.container || document.head
      if (node.parentNode !== parent) {
        // $FlowFixMe
        parent.appendChild(node)
      }
    })
  }
  const context: CSSContextType = {
    stylis,
    sheet: new StyleSheet({
      key: options.key,
      container: options.container,
      nonce: options.nonce
    }),
    inserted,
    registered: {},
    theme: {}
  }
  return context
}

export default createCache
