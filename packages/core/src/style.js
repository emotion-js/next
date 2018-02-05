// @flow
import * as React from 'react'
import { CSSContext } from './context'
import type { CSSContextType, InsertableStyles } from './types'
import { hydration, isBrowser, insertStyles } from './utils'
import { serializeStyles } from './serialize'

export class Style extends React.Component<{
  styles: InsertableStyles | Array<InsertableStyles>
}> {
  shouldHydrate: boolean
  serialized: string
  shouldHydrate = hydration.shouldHydrate

  componentDidMount() {
    hydration.shouldHydrate = false
  }
  render() {
    return (
      <CSSContext.Consumer>
        {context => {
          const { styles } = this.props
          let rules = ''
          if (Array.isArray(styles)) {
            styles.forEach(style => {
              rules += insertStyles(context, style)
            })
          } else {
            rules = insertStyles(context, styles)
          }
          if (
            this.serialized === undefined &&
            (this.shouldHydrate || !isBrowser)
          ) {
            this.serialized = rules
          }
          if (this.shouldHydrate || !isBrowser) {
            return (
              <style
                data-more=""
                dangerouslySetInnerHTML={{ __html: this.serialized }}
              />
            )
          }
          return null
        }}
      </CSSContext.Consumer>
    )
  }
}
