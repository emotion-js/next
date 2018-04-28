// @flow
import type {
  ScopedInsertableStyles,
  KeyframesInsertableStyles
} from '@emotion/types'

const keyframes = (arg: ScopedInsertableStyles): KeyframesInsertableStyles => {
  const name = `animation-${arg.name}`
  return {
    type: 2,
    name,
    styles: `@keyframes ${name}{${arg.styles}}`
  }
}

export default keyframes
