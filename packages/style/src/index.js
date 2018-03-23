// @flow
import * as React from 'react'
import { consumer, hydration } from '@emotion/core'
import type { InsertableStyles, CSSContextType } from '@emotion/types'
import { insertStyles, isBrowser } from '@emotion/utils'

type Props = {
  styles: InsertableStyles | Array<InsertableStyles>
}

export default class Style extends React.Component<Props> {
  serialized: string
  shouldHydrate = hydration.shouldHydrate
  renderChild = (context: CSSContextType) => {
    const { styles } = this.props
    let rules = ''
    let hashThing = ''
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
          hashThing && (hashThing += ' ')
          hashThing += style.name
          console.log(style)
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
        hashThing = styles.name
      }
    }
    if (this.serialized === undefined && this.shouldHydrate) {
      this.serialized = rules
    }
    if (isBrowser === false) {
      return (
        <style
          data-more={hashThing}
          dangerouslySetInnerHTML={{ __html: this.serialized }}
        />
      )
    }
    return null
  }

  componentDidMount() {
    hydration.shouldHydrate = false
  }
  render() {
    return consumer(this, this.renderChild)
  }
}
