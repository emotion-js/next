// @flow
import stylis from './stylis'
import { StyleSheet } from '@emotion/sheet'
import { isBrowser } from '@emotion/utils'
import type { CSSContextType } from '@emotion/types'

const createCache = () => {
  const context: CSSContextType = {
    stylis,
    sheet: new StyleSheet({ key: '' }),
    inserted: {},
    registered: {},
    theme: {}
  }
  if (isBrowser) {
    context.sheet.inject()
  }
  return context
}

export default createCache
