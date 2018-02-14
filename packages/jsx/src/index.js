// @flow
import * as React from 'react'
import { hydration, consumer } from '@emotion/core'
import { isBrowser, getRegisteredStyles, insertStyles } from '@emotion/utils'
import type { CSSContextType } from '@emotion/types'
import { serializeStyles } from '@emotion/serialize'

type Props = {
  props: Object | null,
  type: React.ElementType,
  children: Array<React.Node>
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
  renderChild = (context: CSSContextType) => {
    const { props, type, children } = this.props
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
    const serialized = serializeStyles(registeredStyles)
    const rules = insertStyles(context, serialized)
    className += serialized.cls
    if (this.serialized === undefined && (this.shouldHydrate || !isBrowser)) {
      this.serialized = rules
    }

    const newProps = {
      ...actualProps,
      className
    }
    delete newProps.css
    const ele = React.createElement(type, newProps, ...children)
    if (this.serialized !== undefined) {
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
  render() {
    return consumer(this, this.renderChild)
  }
}

// $FlowFixMe
const jsx: typeof React.createElement = (
  type: React.ElementType,
  props: Object | null,
  ...children: Array<React.Node>
) => {
  if (props == null || props.css == null || type.__emotion_component === true) {
    return React.createElement(type, props, ...children)
  }
  if (typeof props.css === 'string' && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/css' like this: css\`${
        props.css
      }\``
    )
  }

  return <Style props={props} type={type} children={children} />
}

export default jsx
