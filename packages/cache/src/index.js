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
  if (options === undefined) options = {}
  let stylisOptions

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    }
  }

  let stylis = new Stylis(stylisOptions)

  stylis.use(options.stylisPlugins)(ruleSheetPlugin)

  let inserted = {}

  if (isBrowser) {
    const nodes = document.querySelectorAll('style[data-emotion-ssr]')

    Array.prototype.forEach.call(nodes, (node: HTMLStyleElement) => {
      const attrib = node.getAttribute('data-emotion-ssr')
      // $FlowFixMe
      attrib.split(' ').forEach(id => {
        inserted[id] = true
      })
      if (node.parentNode !== document.head) {
        // $FlowFixMe
        document.head.appendChild(node)
      }
    })
  }
  const context: CSSContextType = {
    stylis,
    sheet: new StyleSheet({ key: '' }),
    inserted,
    registered: {},
    theme: {}
  }
  return context
}

export default createCache
