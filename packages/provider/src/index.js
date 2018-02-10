// @flow
import * as React from 'react'
import { CSSContext } from '@emotion/core'
import type { CSSContextType } from '@emotion/types'

type Props = { theme: Object | (Object => Object), cache?: CSSContextType }

export default class Provider extends React.Component<Props> {
  consumer = (context: CSSContextType | null) => {
    if (context === null || this.props.cache) {
    }
  }
  render() {
    return <CSSContext.Consumer children={this.consumer} />
  }
}
