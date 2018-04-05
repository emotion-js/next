// @flow
import stylis from './stylis'
import { StyleSheet } from '@emotion/sheet'
import { isBrowser } from '@emotion/utils'
import type { CSSContextType } from '@emotion/types'

const createCache = () => {
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
