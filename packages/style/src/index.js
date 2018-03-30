// @flow
import * as React from 'react'
import { consumer } from '@emotion/core'
import type { InsertableStyles, CSSContextType } from '@emotion/types'
import { insertStyles, shouldSerializeToReactTree } from '@emotion/utils'

type Props = {
  styles: InsertableStyles | Array<InsertableStyles>
}

export default class Style extends React.Component<Props> {
  serialized: string
  renderChild = (context: CSSContextType) => {
    const { styles } = this.props
    let rules = ''
    let hash = ''
    if (Array.isArray(styles)) {
      styles.forEach(style => {
        let renderedStyle = insertStyles(
          context,
          style,
          this.serialized === undefined && this.shouldHydrate
        )
        if (renderedStyle !== undefined) {
          // $FlowFixMe
          rules += renderedStyle
          hash += ` ${style.name}`
        }
      })
    } else {
      let renderedStyle = insertStyles(
        context,
        styles,
        this.serialized === undefined && this.shouldHydrate
      )
      if (renderedStyle !== undefined) {
        rules = renderedStyle
        hash += ` ${styles.name}`
      }
    }
    if (shouldSerializeToReactTree && rules !== '') {
      return (
        <style
          data-emotion-ssr={hash.substring(1)}
          dangerouslySetInnerHTML={{ __html: rules }}
        />
      )
    }
    return null
  }

  render() {
    return consumer(this, this.renderChild)
  }
}
