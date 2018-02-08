// @flow
import * as React from 'react'
import { CSSContext } from './context'
import type { CSSContextType, InsertableStyles } from './types'
import { hydration, isBrowser, insertStyles } from './utils'
import { serializeStyles } from './serialize'

export const keyframes = (arg: InsertableStyles): InsertableStyles => {
  const name = `animation-${arg.name}`
  const ret = {
    styles: `@keyframes ${name}{${arg.styles}}`,
    name,
    type: 2,
    toString: function() {
      return this.name
    }
  }
  return ret
}
