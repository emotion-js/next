// @flow
import type { ScopedInsertableStyles } from '@emotion/utils'

type Keyframes = {|
  name: string,
  styles: string
|}

const keyframes = (arg: ScopedInsertableStyles): Keyframes => {
  const name = `animation-${arg.name}`
  return {
    name,
    styles: `@keyframes ${name}{${arg.styles}}`
  }
}

export default keyframes
