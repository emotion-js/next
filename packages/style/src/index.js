// @flow
import * as React from 'react'
import { consumer, hydration } from '@emotion/core'
import type { InsertableStyles, CSSContextType } from '@emotion/types'
import { insertStyles } from '@emotion/utils'

type Props = {
  styles: InsertableStyles | Array<InsertableStyles>
}

export default class Style extends React.Component<Props> {
  shouldHydrate: boolean
  serialized: string
  renderChild: CSSContextType => React.Node
  constructor() {
    super()
    this.shouldHydrate = hydration.shouldHydrate
    this.renderChild = (context: CSSContextType) => {
      const { styles } = this.props
      let rules = ''
      if (Array.isArray(styles)) {
        styles.forEach(style => {
          let renderedStyle = insertStyles(context, style)
          if (renderedStyle !== undefined) {
            // $FlowFixMe
            rules += renderedStyle
          }
        })
      } else {
        let renderedStyle = insertStyles(context, styles)
        if (renderedStyle !== undefined) {
          rules = renderedStyle
        }
      }
      if (this.serialized === undefined && this.shouldHydrate) {
        this.serialized = rules
      }
      if (this.shouldHydrate && rules !== '') {
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

  componentDidMount() {
    hydration.shouldHydrate = false
  }
  render() {
    return consumer(this, this.renderChild)
  }
}
