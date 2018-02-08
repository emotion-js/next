// @flow
import * as React from 'react'
import { hydration, isBrowser, insertStyles } from './utils'
import { serializeStyles } from './serialize'
import { CSSContext } from './context'
import { DynamicStyleSheet } from './sheet'

type Props = {
  css: Object,
  render: string => React.Node
}

const StyleSheetOptions = { key: 'dynamic' }

export class Dynamic extends React.Component<Props> {
  shouldHydrate: boolean
  serialized: string
  shouldHydrate = hydration.shouldHydrate
  sheet: DynamicStyleSheet
  componentDidMount() {
    hydration.shouldHydrate = false
  }
  componentWillUnmount() {
    if (this.sheet !== undefined) {
      this.sheet.flush()
    }
  }
  render() {
    return (
      <CSSContext.Consumer>
        {context => {
          const { css } = this.props
          const serialized = serializeStyles([css])
          const rules = context.stylis(
            `.css-${serialized.name}`,
            serialized.styles
          )
          if (this.sheet === undefined && isBrowser) {
            this.sheet = new DynamicStyleSheet(StyleSheetOptions)
            this.sheet.inject()
          }
          if (isBrowser) {
            this.sheet.insertRules(rules)
          }

          if (
            this.serialized === undefined &&
            (this.shouldHydrate || !isBrowser)
          ) {
            this.serialized = rules.join('')
          }
          const child = this.props.render(serialized.cls)
          if (this.shouldHydrate || !isBrowser) {
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
        }}
      </CSSContext.Consumer>
    )
  }
}
