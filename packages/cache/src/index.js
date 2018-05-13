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

let createCache = (options?: Options): CSSContextType => {
  if (options === undefined) options = {}
  let key = options.key || 'css'
  let stylisOptions

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    }
  }

  let stylis = new Stylis(stylisOptions)

  stylis.use(options.stylisPlugins)(ruleSheetPlugin)

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error(
        `Emotion key must only contain lower case alphabetical characters and - but "${key}" was passed`
      )
    }
    let sourceMapRegEx = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//
    let currentSourceMap
    stylis.use((context, content) => {
      if (context === -1) {
        let result = sourceMapRegEx.exec(content)
        if (result) {
          currentSourceMap = result[0]
        }
      }
      if (context === -2) {
        if (currentSourceMap) {
          content.forEach((rule, i) => {
            content[i] = rule + currentSourceMap
          })

          currentSourceMap = ''
        }
      }
    })
  }
  let inserted = {}

  if (isBrowser) {
    const nodes = document.querySelectorAll(
      // $FlowFixMe
      `style[data-emotion-${key}]`
    )

    Array.prototype.forEach.call(nodes, (node: HTMLStyleElement) => {
      // $FlowFixMe
      const attrib = node.getAttribute(`data-emotion-${key}`)
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
    key,
    sheet: new StyleSheet({
      key,
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
