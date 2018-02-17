// @flow
import * as React from 'react'
import { STYLES_KEY } from 'emotion-utils'
import type { ElementType } from 'react'
import {
  testOmitPropsOnComponent,
  testAlwaysTrue,
  testOmitPropsOnStringTag,
  omitAssign,
  type Interpolations,
  type StyledOptions,
  type CreateStyled
} from './utils'
import type { CSSContextType } from '@emotion/types'
import { hydration, consumer } from '@emotion/core'
import { getRegisteredStyles, insertStyles } from '@emotion/utils'
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
      isReal && tag[STYLES_KEY] !== undefined ? tag[STYLES_KEY].slice(0) : []
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

    class Styled extends React.Component<*> {
      mergedProps: Object
      shouldHydrate: boolean
      serialized: string
      static toString: () => string
      static __emotion_real: any
      static __emotion_styles: Interpolations
      static __emotion_base: Styled
      static withComponent: (ElementType, options?: StyledOptions) => any
      constructor(props) {
        super(props)
        this.shouldHydrate = hydration.shouldHydrate
      }
      componentDidMount() {
        hydration.shouldHydrate = false
      }
      renderChild = (context: CSSContextType) => {
        let className = ''
        let classInterpolations = []
        this.mergedProps = omitAssign(testAlwaysTrue, {}, this.props, {
          theme: context.theme || this.props.theme || {}
        })
        if (typeof this.props.className === 'string') {
          className += getRegisteredStyles(
            context.registered,
            classInterpolations,
            this.props.className
          )
        }
        const serialized = serializeStyles.call(
          this,
          styles.concat(classInterpolations)
        )
        const rules = insertStyles(context, serialized)
        className += serialized.cls

        if (this.serialized === undefined && this.shouldHydrate) {
          this.serialized = rules
        }

        const ele = React.createElement(
          baseTag,
          omitAssign(omitFn, {}, this.props, {
            className,
            ref: this.props.innerRef
          })
        )
        if (this.shouldHydrate && this.serialized !== undefined) {
          return (
            <React.Fragment>
              <style
                data-more={serialized.name}
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
    Styled.displayName =
      identifierName !== undefined
        ? identifierName
        : `Styled(${
            typeof baseTag === 'string'
              ? baseTag
              : baseTag.displayName || baseTag.name || 'Component'
          })`

    Styled[STYLES_KEY] = styles
    Styled.__emotion_base = baseTag
    Styled.__emotion_real = Styled

    Styled.withComponent = (
      nextTag: ElementType,
      nextOptions?: StyledOptions
    ) => {
      return createStyled(
        nextTag,
        nextOptions !== undefined
          ? // $FlowFixMe
            omitAssign(testAlwaysTrue, {}, options, nextOptions)
          : options
      )(...args)
    }

    return Styled
  }
}

export default createStyled
