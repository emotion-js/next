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
  scoped,
  hydration
} from './utils'
import type { CSSContextType, CSSCache } from './types'
import { serializeStyles } from './serialize'
import { CSSContext } from './context'

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

    const { cls, rules } = scoped(
      context,
      serializeStyles(context.registered, registeredStyles)
    )
    className += cls
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
  serialized: string
  shouldHydrate: boolean

  constructor(props: *) {
    super(props)
    this.sheet = new StyleSheet({ key: 'global' })
    this.sheet.inject()
    this.shouldHydrate = hydration.shouldHydrate
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
  componentDidMount() {
    hydration.shouldHydrate = false
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
  }
  insert(
    context: CSSContextType,
    { name, styles }: { name: string, styles: string }
  ) {
    this.oldName = name
    let rules = this.props.context.stylis(``, styles)
    let needsToSerializeValues =
      this.serialized === undefined && (this.shouldHydrate || !isBrowser)
    if (needsToSerializeValues) {
      this.serialized = rules.join('')
    }

    if (isBrowser && !needsToSerializeValues) {
      this.sheet.flush()
      this.sheet.inject()
      rules.forEach(rule => {
        this.sheet.insert(rule)
      })
    }
    // I need tests
    if (this.shouldHydrate && !needsToSerializeValues) {
      this.serialized = ''
      this.forceUpdate()
    }
  }
  render() {
    if (this.serialized !== undefined) {
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

// todo: make it so this type checks props with flow correctly
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
export { Keyframes } from './keyframes'
