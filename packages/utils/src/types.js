// @flow
export type CSSCache = { [string]: string }

export type InsertedCache = { [string]: string | true }

interface StyleSheet {
  container: HTMLElement;
  insert(rule: string): void;
  flush(): void;
}

export type CSSContextType = {
  stylis: (string, string) => Array<string>,
  inserted: InsertedCache,
  registered: CSSCache,
  sheet: StyleSheet,
  theme: Object,
  key: string,
  compat?: true
}

export type Interpolation = any

export type ScopedInsertableStyles = {|
  name: string,
  styles: string
|}
export type Keyframes = {|
  name: string,
  styles: string
|}
