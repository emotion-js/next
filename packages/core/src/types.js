// @flow
export type CSSCache = { [string]: string }

export type CSSContextType = {
  stylis: Function,
  inserted: CSSCache,
  registered: CSSCache
}
