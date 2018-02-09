// @flow
export type CSSCache = { [string]: string }

interface StyleSheet {
  insert(rule: string): void;
  inject(): void;
  flush(): void;
}

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

export const SCOPED_TYPE = 1
export const KEYFRAMES_TYPE = 2
