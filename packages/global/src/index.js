// @flow
import * as React from 'react'
import { consumer, hydration } from '@emotion/core'
import type { CSSContextType } from '@emotion/types'
import StyleSheet from '@emotion/sheet'
import { isBrowser } from '@emotion/utils'
import { serializeStyles } from '@emotion/serialize'

type GlobalProps = {
  css: Object
}

const Global = ({ css }: GlobalProps) => {
  return consumer(context => {
    return <GlobalChild css={css} context={context} />
  })
}

Global.__emotion_component = true

class GlobalChild extends React.Component<{
  ...GlobalProps,
  context: CSSContextType
}> {
  sheet: StyleSheet
  oldName: string
  serialized: string
  shouldHydrate: boolean

  constructor(props: *) {
    super(props)
    this.sheet = new StyleSheet({ key: 'global' })
    this.sheet.inject()
    this.shouldHydrate = hydration.shouldHydrate
  }
  componentWillMount() {
    this.insert(this.props.context, serializeStyles([this.props.css]))
  }
  componentWillUnmount() {
    this.sheet.flush()
  }
  componentDidMount() {
    hydration.shouldHydrate = false
  }
  componentWillReceiveProps(nextProps: *) {
    if (
      nextProps.context === this.props.context &&
      nextProps.css === this.props.css
    ) {
      return
    }
    let serialized = serializeStyles([this.props.css])
    if (serialized.name !== this.oldName) {
      this.insert(nextProps.context, serialized)
    }
  }
  // TODO: move all this stuff to render
  insert(
    context: CSSContextType,
    { name, styles }: { name: string, styles: string }
  ) {
    this.oldName = name
    let rules = this.props.context.stylis(``, styles)
    let needsToSerializeValues =
      this.serialized === undefined && (this.shouldHydrate || !isBrowser)
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
    // I need tests
    if (this.shouldHydrate && !needsToSerializeValues) {
      this.serialized = ''
      this.forceUpdate()
    }
  }
  render() {
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
}

export default Global
