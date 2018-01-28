// @flow
import StyleSheet from './sheet'
export type CSSCache = { [string]: string }

export type CSSContextType = {
  stylis: Function,
  inserted: CSSCache,
  registered: CSSCache,
  sheet: StyleSheet,
  theme: Object
}
