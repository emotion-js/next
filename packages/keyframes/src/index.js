// @flow
import type { ScopedInsertableStyles, Keyframes } from '@emotion/utils'

const keyframes = (arg: ScopedInsertableStyles): Keyframes => {
  const name = `animation-${arg.name}`
  return {
    name,
    styles: `@keyframes ${name}{${arg.styles}}`
  }
}

export default keyframes
