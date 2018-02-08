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

export type Interpolation = any

export type ScopedInsertableStyles = {
  name: string,
  styles: string,
  type: 1,
  cls: string
}
export type KeyframesInsertableStyles = {
  name: string,
  styles: string,
  type: 2
}

export type InsertableStyles =
  | ScopedInsertableStyles
  | KeyframesInsertableStyles
