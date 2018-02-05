// @flow
import * as React from 'react'
import { CSSContext } from './context'
import type { CSSContextType, InsertableStyles } from './types'
import { hydration, isBrowser, insertStyles } from './utils'
import { serializeStyles } from './serialize'

export const keyframes = (arg: { styles: string, name: string }) => {
  const name = `animation-${arg.name}`
  const ret = {
    styles: `@keyframes ${name}{${arg.styles}}`,
    name,
    scope: '',
    toString: () => `animation-${arg.name}`
  }
  return ret
}
