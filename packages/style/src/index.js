// @flow
import * as React from 'react'
import { consumer, hydration } from '@emotion/core'
import type { InsertableStyles, CSSContextType } from '@emotion/types'
import { isBrowser, insertStyles } from '@emotion/utils'

export default class Style extends React.Component<{
  styles: InsertableStyles | Array<InsertableStyles>
}> {
  shouldHydrate: boolean
  serialized: string
  constructor() {
    super()
    this.shouldHydrate = hydration.shouldHydrate
  }

  componentDidMount() {
    hydration.shouldHydrate = false
  }
  renderChild = (context: CSSContextType) => {
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
    if (this.serialized === undefined && (this.shouldHydrate || !isBrowser)) {
      this.serialized = rules
    }
    if ((this.shouldHydrate || !isBrowser) && rules !== '') {
      return (
        <style
          data-more=""
          dangerouslySetInnerHTML={{ __html: this.serialized }}
        />
      )
    }
    return null
  }
  render() {
    return consumer(this, this.renderChild)
  }
}
