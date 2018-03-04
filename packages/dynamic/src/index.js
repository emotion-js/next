// @flow
import * as React from 'react'
import { hydration, consumer } from '@emotion/core'
import { isBrowser } from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'
import { DynamicStyleSheet } from '@emotion/sheet'
import type { CSSContextType } from '@emotion/types'

type Props = {
  css: Object,
  render: string => React.Node
}

const StyleSheetOptions = { key: 'dynamic' }

class Dynamic extends React.Component<Props> {
  shouldHydrate: boolean
  serialized: string
  shouldHydrate = hydration.shouldHydrate
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

    if (this.serialized === undefined && this.shouldHydrate) {
      this.serialized = rules.join('')
    }
    const child = this.props.render(serialized.cls)
    if (this.shouldHydrate) {
      return (
        <React.Fragment>
          <style
            data-more=""
            dangerouslySetInnerHTML={{ __html: this.serialized }}
          />
          {child}
        </React.Fragment>
      )
    }
    return child
  }

  componentDidMount() {
    hydration.shouldHydrate = false
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
