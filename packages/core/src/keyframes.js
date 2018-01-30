// @flow
import * as React from 'react'
import { CSSContext } from './context'
import type { CSSContextType } from './types'
import { hydration, isBrowser } from './utils'
import { serializeStyles } from './serialize'

export const keyframes = (arg: { __styles: string }) => {
  const serialized = serializeStyles(null, [arg])
  const ret: {
    toString?: () => string,
    __serialized: typeof serialized
  } = {
    __serialized: serialized
  }
  Object.defineProperty(ret, 'toString', {
    enumerable: false,
    value() {
      return `animation-${serialized.name}`
    }
  })
  return ret
}

export const insertKeyframes = (
  context: CSSContextType,
  { name, styles }: { name: string, styles: string }
) => {
  if (context.inserted[name] === undefined) {
    let rules = context.stylis(``, styles)
    context.inserted[name] = rules.join('')
    if (isBrowser) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
  }
  return context.inserted[name]
}

export const Keyframes = ({ keyframes }: { keyframes: Object }) => {
  return (
    <CSSContext.Consumer>
      {context => {
        return <KeyframesChild keyframes={keyframes} context={context} />
      }}
    </CSSContext.Consumer>
  )
}

class KeyframesChild extends React.Component<{
  context: CSSContextType,
  keyframes: { __serialized: { name: string, styles: string } }
}> {
  shouldHydrate: boolean
  serialized: string
  constructor(props) {
    super(props)
    this.shouldHydrate = hydration.shouldHydrate
  }
  componentDidMount() {
    hydration.shouldHydrate = false
  }
  render() {
    const { keyframes, context } = this.props
    const name = `animation-${keyframes.__serialized.name}`
    const serialized = {
      name,
      styles: `@keyframes ${name}{${keyframes.__serialized.styles}}`
    }
    const rules = insertKeyframes(context, serialized)
    if (this.serialized === undefined && (this.shouldHydrate || !isBrowser)) {
      this.serialized = rules
    }
    if (this.shouldHydrate || !isBrowser) {
      return (
        <style
          data-more=""
          dangerouslySetInnerHTML={{ __html: this.serialized }}
        />
      )
    }
    return null
  }
}
