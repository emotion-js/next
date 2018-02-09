// @flow
import type {
  CSSContextType,
  ScopedInsertableStyles,
  KeyframesInsertableStyles
} from '@emotion/types'

const keyframes = (arg: ScopedInsertableStyles): KeyframesInsertableStyles => {
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

export default keyframes
