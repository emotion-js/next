// @flow
import * as React from 'react'
import { CSSContext } from '@emotion/core'
import type { CSSContextType } from '@emotion/types'
import createCache from '@emotion/cache'

type Props = { theme?: Object | (Object => Object), children?: React.Node }

export default class Provider extends React.Component<Props> {
  emotionCache: CSSContextType
  consumer = (context: CSSContextType | null) => {
    let newContext = context
    if (context === null) {
      if (this.emotionCache === undefined) {
        newContext = createCache()
        if (this.props.theme) {
          newContext.theme = this.props.theme
        }
      } else if (this.props.theme !== this.emotionCache.theme) {
        newContext = { ...this.emotionCache, theme: this.props.theme }
      }
    } else if (this.props.theme && this.props.theme !== context.theme) {
      newContext = { ...context, theme: this.props.theme }
    }
    return (
      <CSSContext.Provider value={newContext}>
        {this.props.children}
      </CSSContext.Provider>
    )
  }
  render() {
    return <CSSContext.Consumer children={this.consumer} />
  }
}
