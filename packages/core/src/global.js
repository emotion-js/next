// @flow
import * as React from 'react'
import { consume } from './context'
import { StyleSheet } from '@emotion/sheet'
import {
  isBrowser,
  shouldSerializeToReactTree,
  type CSSContextType
} from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'

type GlobalProps = {
  css: Object | Array<Object>
}

export class Global extends React.Component<GlobalProps> {
  sheet: StyleSheet
  oldName: string
  serialized: string
  static __emotion_component = true
  renderChild = (context: CSSContextType) => {
    const serialized = serializeStyles(context.registered, [this.props.css])
    if (this.oldName !== serialized.name) {
      if (isBrowser) {
        this.sheet = new StyleSheet({
          key: `${context.key}-global`,
          // $FlowFixMe
          nonce: context.sheet.nonce,
          container: context.sheet.container
        })
      }
      this.oldName = serialized.name
      let rules = context.stylis(``, serialized.styles)
      if (shouldSerializeToReactTree) {
        this.serialized = rules.join('')
      }

      if (isBrowser) {
        this.sheet.flush()
        rules.forEach(rule => {
          this.sheet.insert(rule)
        })
      }
    }
    if (shouldSerializeToReactTree) {
      return (
        <style
          {...{
            [`data-emotion-${context.key}`]: serialized.name,
            dangerouslySetInnerHTML: { __html: this.serialized }
          }}
        />
      )
    }
    return null
  }

  componentWillUnmount() {
    this.sheet.flush()
  }
  render() {
    return consume(this.renderChild)
  }
}
