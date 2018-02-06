// @flow
import * as React from 'react'
import { Stylis, hashString } from 'emotion-utils'
import stylisRuleSheet from 'stylis-rule-sheet'
import StyleSheet from './sheet'
import {
  processStyleName,
  processStyleValue,
  isBrowser,
  getRegisteredStyles,
  insertStyles,
  hydration
} from './utils'
import type { CSSContextType, CSSCache } from './types'
import { serializeStyles } from './serialize'
import { CSSContext } from './context'
import { Global } from './global'
import { Dynamic } from './dynamic'

type Props = {
  props: Object | null,
  type: React.ElementType,
  children: Array<React.Node>,
  context: CSSContextType
}

class Style extends React.Component<Props> {
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
    const { props, type, children, context } = this.props
    let actualProps = props || {}

    let registeredStyles = []

    let className = ''
    if (actualProps.className !== undefined) {
      className = getRegisteredStyles(
        context.registered,
        registeredStyles,
        actualProps.className
      )
    }
    registeredStyles.push(
      typeof actualProps.css === 'function'
        ? actualProps.css(context.theme)
        : actualProps.css
    )
    const serialized = serializeStyles(context.registered, registeredStyles)
    const rules = insertStyles(context, serialized)
    className += serialized.toString()
    if (this.serialized === undefined && (this.shouldHydrate || !isBrowser)) {
      this.serialized = rules
    }

    const newProps = {
      ...actualProps,
      className
    }
    delete newProps.css
    const ele = React.createElement(type, newProps, ...children)
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

// todo: make it so this type checks props with flow correctly
// $FlowFixMe
export const jsx: typeof React.createElement = (
  type: React.ElementType,
  props: Object | null,
  ...children: Array<React.Node>
) => {
  if (
    props == null ||
    props.css == null ||
    type === Global ||
    type === Style ||
    type === Dynamic
  ) {
    return React.createElement(type, props, ...children)
  }
  if (process.env.NODE_ENV === 'development' && typeof props.css === 'string') {
    throw new Error(
      `Strings are not allowed as css prop values, please wrap it in a css template literal like this: css\`${
        props.css
      }\``
    )
  }

  return (
    <CSSContext.Consumer>
      {context => (
        <Style
          props={props}
          type={type}
          children={children}
          context={context}
        />
      )}
    </CSSContext.Consumer>
  )
}

export { default as Provider } from './provider'
export { css } from './css'
export { default as styled } from './styled'
export { Global, Dynamic }
export { Style } from './style'
export { keyframes } from './keyframes'
