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
  scoped
} from './utils'
import type { CSSContextType, CSSCache } from './types'
import { serializeStyles } from './serialize'
import { CSSContext } from './context'

let shouldHydrate = false

if (isBrowser) {
  shouldHydrate = !!document.querySelector('data-more')
}

type Props = {
  props: Object | null,
  type: React.ElementType,
  children: Array<React.Node>,
  context: CSSContextType
}

class Style extends React.Component<Props> {
  constructor(props) {
    super(props)
    if (shouldHydrate) {
    }
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

    className += scoped(
      context,
      serializeStyles(context.registered, registeredStyles)
    )

    const newProps = {
      ...actualProps,
      className
    }
    delete newProps.css

    return React.createElement(type, newProps, ...children)
  }
}

type GlobalProps = {
  css: Object
}

export const Global = ({ css }: GlobalProps) => {
  return (
    <CSSContext.Consumer>
      {context => {
        return <GlobalChild css={css} context={context} />
      }}
    </CSSContext.Consumer>
  )
}

export class GlobalChild extends React.Component<{
  ...GlobalProps,
  context: CSSContextType
}> {
  sheet: StyleSheet
  oldName: string

  constructor(props: *) {
    super(props)
    this.sheet = new StyleSheet({ key: 'global' })
    this.sheet.inject()
  }
  componentWillMount() {
    this.insert(
      this.props.context,
      serializeStyles(this.props.context.registered, [this.props.css])
    )
  }
  componentWillUnmount() {
    this.sheet.flush()
  }
  componentWillReceiveProps(nextProps: *) {
    if (
      nextProps.context === this.props.context &&
      nextProps.css === this.props.css
    ) {
      return
    }
    let serialized = serializeStyles(this.props.context.registered, [
      this.props.css
    ])
    if (serialized.name !== this.oldName) {
      this.insert(nextProps.context, serialized)
    }
    0
  }
  insert(
    context: CSSContextType,
    { name, styles }: { name: string, styles: string }
  ) {
    this.oldName = name
    let rules = this.props.context.stylis(``, styles)
    if (isBrowser) {
      this.sheet.flush()
      rules.forEach(rule => {
        this.sheet.insert(rule)
      })
    }
  }
  render() {
    return null
  }
}

export const jsx = (
  type: React.ElementType,
  props: Object | null,
  ...children: Array<React.Node>
) => {
  if (props == null || props.css == null || type === Global) {
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
export { createStyles as css } from './serialize'
export { default as styled } from './styled'
