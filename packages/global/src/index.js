// @flow
import * as React from 'react'
import { consumer, hydration } from '@emotion/core'
import type { CSSContextType } from '@emotion/types'
import { StyleSheet } from '@emotion/sheet'
import { isBrowser } from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'

type GlobalProps = {
  css: Object
}

class Global extends React.Component<GlobalProps> {
  sheet: StyleSheet
  oldName: string
  serialized: string
  shouldHydrate: boolean
  renderChild: CSSContextType => React.Node
  static __emotion_component = true
  shouldHydrate = hydration.shouldHydrate
  renderChild = (context: CSSContextType) => {
    const serialized = serializeStyles([this.props.css])
    if (this.oldName !== serialized.name) {
      if (isBrowser) {
        this.sheet = new StyleSheet({ key: 'global' })
        this.sheet.inject()
      }
      this.oldName = serialized.name
      let rules = context.stylis(``, serialized.styles)
      let needsToSerializeValues =
        this.serialized === undefined && this.shouldHydrate
      if (needsToSerializeValues) {
        this.serialized = rules.join('')
      }

      if (isBrowser && !needsToSerializeValues) {
        this.sheet.flush()
        this.sheet.inject()
        rules.forEach(rule => {
          this.sheet.insert(rule)
        })
      }
      if (this.shouldHydrate && !needsToSerializeValues) {
        this.serialized = ''
      }
    }
    if (this.serialized !== undefined) {
      return (
        <style
          data-more=""
          dangerouslySetInnerHTML={{ __html: this.serialized }}
        />
      )
    }
    return null
  }

  componentWillUnmount() {
    this.sheet.flush()
  }
  componentDidMount() {
    hydration.shouldHydrate = false
  }
  render() {
    return consumer(this, this.renderChild)
  }
}

export default Global
