// @flow
import * as React from 'react'
import { Stylis, hashString } from 'emotion-utils'
import stylisRuleSheet from 'stylis-rule-sheet'
import StyleSheet from './sheet'
import { processStyleName, processStyleValue, isBrowser } from './utils'
import createReactContext, { type Context } from 'create-react-context'
import type { CSSContextType, CSSCache } from './types'
import { serializeStyles } from './serialize'

let shouldHydrate = false

if (isBrowser) {
  shouldHydrate = !!document.querySelector('data-more')
}

const defaultContext: CSSContextType = {
  stylis: new Stylis(),
  sheet: new StyleSheet({ key: '' }),
  inserted: {},
  registered: {}
}

if (isBrowser) {
  defaultContext.sheet.inject()
}

let current

let sheetToInsert

const insertionPlugin = stylisRuleSheet(function(rule: string) {
  current.push(rule)
})

const returnFullPlugin = function(context) {
  if (context === -1) {
    current = []
  }
  if (context === -2) {
    return current
  }
}

defaultContext.stylis.use(insertionPlugin)(returnFullPlugin)

const CSSContext: Context<CSSContextType> = createReactContext(defaultContext)

type Props = {
  props: Object | null,
  type: React.ElementType,
  children: Array<React.Node>,
  context: CSSContextType
}

function getRegisteredStyles(
  registered: CSSCache,
  registeredStyles: string[],
  classNames: string
) {
  let rawClassName = ''

  classNames.split(' ').forEach(className => {
    if (registered[className] !== undefined) {
      registeredStyles.push(className)
    } else {
      rawClassName += `${className} `
    }
  })
  return rawClassName
}

const scoped = (context: CSSContextType, rawStyles: *) => {
  const { name, styles } = serializeStyles(context.registered, rawStyles)

  let cls = `css-${name}`
  if (context.registered[cls] === undefined) {
    context.registered[cls] = styles
  }
  if (context.inserted[name] === undefined) {
    let rules = context.stylis(`.${cls}`, styles)
    if (isBrowser) {
      rules.forEach(rule => {
        context.sheet.insert(rule)
      })
    }
  }
  return cls
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
    registeredStyles.push(actualProps.css)

    className += scoped(context, registeredStyles)

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
  console.log(type)
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
  console.log(type)

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
