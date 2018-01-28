// @flow
import * as React from 'react'
import { CSSContext } from './context'
import type { CSSContextType } from './types'
import { hydration, isBrowser } from './utils'
import { serializeStyles } from './serialize'

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

// I'm not totally sure if this is the best way to do keyframes
export const Keyframes = ({
  keyframes,
  render
}: {
  keyframes: Object,
  render: string => React.Node
}) => {
  return (
    <CSSContext.Consumer>
      {context => {
        return (
          <KeyframesChild
            keyframes={keyframes}
            render={render}
            context={context}
          />
        )
      }}
    </CSSContext.Consumer>
  )
}

class KeyframesChild extends React.Component<{
  render: string => React.Node,
  context: CSSContextType,
  keyframes: Object
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
    const { keyframes, render, context } = this.props
    const serialized = serializeStyles(context.registered, [
      typeof keyframes === 'function' ? keyframes(context.theme) : keyframes
    ])
    const name = `animation-${serialized.name}`
    serialized.styles = `@keyframes ${name}{${serialized.styles}}`
    const rules = insertKeyframes(context, serialized)
    if (this.serialized === undefined && (this.shouldHydrate || !isBrowser)) {
      this.serialized = rules
    }
    const ele = this.props.render(name)
    if (this.shouldHydrate || !isBrowser) {
      return (
        <React.Fragment>
          <style
            data-more=""
            dangerouslySetInnerHTML={{ __html: this.serialized }}
          />
          {ele}
        </React.Fragment>
      )
    }
    return ele
  }
}
