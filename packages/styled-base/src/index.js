// @flow
import * as React from 'react'
import type { ElementType } from 'react'
import {
  testOmitPropsOnComponent,
  testAlwaysTrue,
  testOmitPropsOnStringTag,
  omitAssign,
  type StyledOptions,
  type CreateStyled
} from './utils'
import { withCSSContext } from '@emotion/core'
import {
  getRegisteredStyles,
  insertStyles,
  shouldSerializeToReactTree
} from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'

let createStyled: CreateStyled = (tag: any, options?: StyledOptions) => {
  if (process.env.NODE_ENV !== 'production') {
    if (tag === undefined) {
      throw new Error(
        'You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.'
      )
    }
  }
  let identifierName
  if (options !== undefined) {
    identifierName = options.label
  }
  const isReal = tag.__emotion_real === tag
  const baseTag = (isReal && tag.__emotion_base) || tag

  const omitFn =
    typeof baseTag === 'string' &&
    baseTag.charAt(0) === baseTag.charAt(0).toLowerCase()
      ? testOmitPropsOnStringTag
      : testOmitPropsOnComponent

  return function() {
    let args = arguments
    let styles =
      isReal && tag.__emotion_styles !== undefined
        ? tag.__emotion_styles.slice(0)
        : []
    if (identifierName !== undefined) {
      styles.push(`label:${identifierName};`)
    }
    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args)
    } else {
      styles.push(args[0][0])
      let len = args.length
      let i = 1
      for (; i < len; i++) {
        styles.push(args[i], args[0][i])
      }
    }

    const Styled = withCSSContext((props, context) => {
      let className = ''
      let classInterpolations = []
      let mergedProps = omitAssign(testAlwaysTrue, {}, props, {
        theme: props.theme || context.theme
      })
      if (typeof props.className === 'string') {
        className += getRegisteredStyles(
          context.registered,
          classInterpolations,
          props.className
        )
      }
      const serialized = serializeStyles.call(
        mergedProps,
        styles.concat(classInterpolations)
      )
      const rules = insertStyles(context, serialized)
      className += serialized.cls

      const ele = React.createElement(
        baseTag,
        omitAssign(omitFn, {}, props, {
          className,
          ref: props.innerRef
        })
      )
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

    Styled.displayName =
      identifierName !== undefined
        ? identifierName
        : `Styled(${
            typeof baseTag === 'string'
              ? baseTag
              : baseTag.displayName || baseTag.name || 'Component'
          })`

    // $FlowFixMe
    const FinalStyled = React.forwardRef((props, ref) => {
      if (ref === null) {
        // this avoids creating a new object if there's no ref
        return <Styled {...props} />
      }
      return <Styled {...props} innerRef={ref} />
    })

    FinalStyled.__emotion_real = FinalStyled
    FinalStyled.__emotion_base = baseTag
    FinalStyled.__emotion_styles = styles

    FinalStyled.withComponent = (
      nextTag: ElementType,
      nextOptions?: StyledOptions
    ) => {
      return createStyled(
        nextTag,
        nextOptions !== undefined ? { ...options, ...nextOptions } : options
      )(...styles)
    }
    return FinalStyled
  }
}

export default createStyled
