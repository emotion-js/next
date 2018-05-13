// @flow
import * as React from 'react'
import { withCSSContext } from '@emotion/core'
import type { InsertableStyles, CSSContextType } from '@emotion/types'
import { insertStyles, shouldSerializeToReactTree } from '@emotion/utils'

type Props = {
  styles: InsertableStyles | Array<InsertableStyles>
}

const Style = withCSSContext((props: Props, context: CSSContextType) => {
  let rules = ''
  let hash = ''
  if (Array.isArray(props.styles)) {
    props.styles.forEach(style => {
      let renderedStyle = insertStyles(context, style)
      if (renderedStyle !== undefined) {
        // $FlowFixMe
        rules += renderedStyle
        hash += ` ${style.name}`
      }
    })
  } else {
    let renderedStyle = insertStyles(context, props.styles)
    if (renderedStyle !== undefined) {
      rules = renderedStyle
      // $FlowFixMe
      hash += ` ${props.styles.name}`
    }
  }
  if (shouldSerializeToReactTree && rules !== '') {
    return (
      <style
        {...{
          [`data-emotion-${context.key}`]: hash.substring(1),
          dangerouslySetInnerHTML: { __html: rules }
        }}
      />
    )
  }
  return null
})

export default Style
