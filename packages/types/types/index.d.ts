// Definitions by: Junyoung Clare Jang <https://github.com/Ailrun>
// TypeScript Version: 2.2

export interface CSSCache {
  [key: string]: string;
}

export interface InsertedCache {
  [key: string]: string | true;
}

export interface StyleSheet {
  container: HTMLElement;
  insert(rule: string): void;
  flush(): void;
}

export interface CSSContextType {
  stylis: (key: string, value: string) => Array<string>;
  inserted: InsertedCache;
  registered: CSSCache;
  sheet: StyleSheet;
  theme: object;
  key: string;
  compat?: true;
}

export interface ScopedInsertableStyles {
  name: string;
  styles: string;
}

export interface Keyframes {
  name: string;
  styles: string;
}
