// @flow
import * as React from 'react'
import { consume } from '@emotion/core'
import {
  getRegisteredStyles,
  insertStyles,
  shouldSerializeToReactTree
} from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'

// $FlowFixMe
const jsx: typeof React.createElement = function(
  type: React.ElementType,
  props: Object
) {
  if (props == null || props.css == null || type.__emotion_component === true) {
    // $FlowFixMe
    return React.createElement.apply(undefined, arguments)
  }
  if (typeof props.css === 'string' && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/css' like this: css\`${
        props.css
      }\``
    )
  }

  return consume(context => {
    let registeredStyles = []

    let className = ''
    if (props.className !== undefined) {
      className = getRegisteredStyles(
        context.registered,
        registeredStyles,
        props.className
      )
    }
    registeredStyles.push(
      typeof props.css === 'function' ? props.css(context.theme) : props.css
    )
    const serialized = serializeStyles(registeredStyles)
    const rules = insertStyles(context, serialized)
    className += serialized.cls

    const newProps = {}
    for (let key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key) && key !== 'css') {
        newProps[key] = props[key]
      }
    }
    newProps.className = className
    let childrenLength = arguments.length

    let createElementArgArray = Array(childrenLength)
    createElementArgArray[0] = type
    createElementArgArray[1] = newProps

    for (let i = 2; i < childrenLength; i++) {
      createElementArgArray[i] = arguments[i + 2]
    }
    // $FlowFixMe
    const ele = React.createElement.apply(undefined, createElementArgArray)
    if (shouldSerializeToReactTree && rules !== undefined) {
      return (
        <React.Fragment>
          <style
            data-emotion-ssr={serialized.name}
            dangerouslySetInnerHTML={{ __html: rules }}
          />
          {ele}
        </React.Fragment>
      )
    }
    return ele
  })
}

export default jsx
