// @flow
import * as React from 'react'
import { isBrowser } from '@emotion/utils'
import { hydration, consumer } from '@emotion/core'
import { DynamicStyleSheet } from '@emotion/sheet'
import type { CSSContextType } from '@emotion/types'
import { hash as doHash } from './hash'

type Props = {
  children: string => React.Node
}

const interpolationPattern = /__EMOTION_INTERPOLATION__(\d+)__EMOTION_INTERPOLATION__/g

const selectorPattern = /__EMOTION_BASE_SELECTOR__/g

const StyleSheetOptions = { key: 'dynamic' }

const dynamic = (
  strings: Array<string>,
  ...interpolations: Array<string | number | (Object => string | number)>
) => {
  const val = strings.reduce((accum, string, i) => {
    if (i === 0) {
      return string
    }
    const interpolation = interpolations[i - 1]

    return (
      accum +
      (typeof interpolation === 'function'
        ? '__EMOTION_INTERPOLATION__' + (i - 1) + '__EMOTION_INTERPOLATION__'
        : interpolation) +
      string
    )
  }, '')
  let compiled = []
  let processed
  let hash

  return class Dynamic extends React.Component<Props> {
    sheet: DynamicStyleSheet
    serialized: ?string
    shouldHydrate: boolean
    renderChild: CSSContextType => React.Node
    constructor(props: Props) {
      super(props)

      this.shouldHydrate = hydration.shouldHydrate
      if (isBrowser) {
        this.sheet = new DynamicStyleSheet(StyleSheetOptions)
        this.sheet.inject()
      }
      this.renderChild = context => {
        if (processed === undefined) {
          processed = context.stylis('__EMOTION_BASE_SELECTOR__', val)
          hash = doHash(processed.join(''))
          compiled =
        }
        const rules = processed.map(thing => {
          let ret = thing.replace(interpolationPattern, (match, p1) => {
            // $FlowFixMe
            return interpolations[Number(p1)](this.props)
          })
          // this probably isn't a good way to hash
          hash += doHash(ret)
          return ret
        })
        const cls = `css-${hash.toString(36)}`
        let actualRules = rules.map(rule => {
          return rule.replace(selectorPattern, `.${cls}`)
        })
        if (this.serialized === undefined && this.shouldHydrate) {
          this.serialized = actualRules.join('')
        }
        if (isBrowser) {
          this.sheet.insertRules(actualRules)
        }

        const child = this.props.children(cls)
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
}

export default dynamic
