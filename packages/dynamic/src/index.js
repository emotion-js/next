// @flow
import * as React from 'react'
import { consumer } from '@emotion/core'
import { isBrowser, shouldSerializeToReactTree } from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'
import { DynamicStyleSheet } from '@emotion/sheet'
import type { CSSContextType } from '@emotion/types'

type Props = {
  css: Object,
  render: string => React.Node
}

const StyleSheetOptions = { key: 'dynamic' }

class Dynamic extends React.Component<Props> {
  sheet: DynamicStyleSheet
  static __emotion_component = true
  renderChild = (context: CSSContextType) => {
    const { css } = this.props
    const serialized = serializeStyles([css])
    const rules = context.stylis(`.css-${serialized.name}`, serialized.styles)
    if (this.sheet === undefined && isBrowser) {
      this.sheet = new DynamicStyleSheet(StyleSheetOptions)
      this.sheet.inject()
    }
    if (isBrowser) {
      this.sheet.insertRules(rules)
    }

    const child = this.props.render(serialized.cls)
    if (shouldSerializeToReactTree && rules.length !== 0) {
      return (
        <React.Fragment>
          <style
            data-emotion-ssr={serialized.name}
            dangerouslySetInnerHTML={{ __html: rules.join('') }}
          />
          {child}
        </React.Fragment>
      )
    }
    return child
  }
  componentWillUnmount() {
    if (this.sheet !== undefined) {
      this.sheet.flush()
    }
  }
  render() {
    return consumer(this, this.renderChild)
  }
}

export default Dynamic
