// @flow
/*

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side

// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

styleSheet.inject()
- 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/

// $FlowFixMe
function sheetForTag(tag: HTMLStyleElement): CSSStyleSheet {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet
  }

  // this weirdness brought to you by firefox
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i]
    }
  }
}

type Options = { nonce?: string, key?: string, container?: HTMLElement }

function makeStyleTag(opts: Options): HTMLStyleElement {
  let tag = document.createElement('style')
  tag.type = 'text/css'
  tag.setAttribute('data-emotion', opts.key || '')
  if (opts.nonce !== undefined) {
    tag.setAttribute('nonce', opts.nonce)
  }
  tag.appendChild(document.createTextNode(''))
  // $FlowFixMe
  ;(opts.container !== undefined ? opts.container : document.head).appendChild(
    tag
  )
  return tag
}

export class DynamicStyleSheet {
  injected: boolean
  opts: Options
  ctr: number
  injected: boolean
  tag: HTMLStyleElement
  sheet: CSSStyleSheet
  constructor(options: Options) {
    this.ctr = 0
    this.opts = options
  }
  inject() {
    if (process.env.NODE_ENV !== 'production' && this.tag !== undefined) {
      throw new Error('This stylesheet has already been injected')
    }
    this.tag = makeStyleTag(this.opts)
    this.sheet = sheetForTag(this.tag)
  }
  insertRules(rules: Array<string>) {
    this.removeRules()
    rules.forEach(this.insert, this)
  }
  insert(rule: string) {
    try {
      this.sheet.insertRule(rule, this.ctr)
      this.ctr++
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Invalid Rule: "${rule}"`, e)
      }
    }
  }
  removeRules() {
    if (this.ctr !== 0) {
      while (this.ctr--) {
        this.sheet.deleteRule(this.ctr)
      }
      this.ctr = 0
    }
  }
  flush() {
    // $FlowFixMe
    this.tag.parentNode.removeChild(this.tag)
    this.ctr = 0
    // $FlowFixMe
    this.tag = undefined
    // $FlowFixMe
    this.sheet = undefined
  }
}

export default class StyleSheet {
  injected: boolean
  isSpeedy: boolean
  ctr: number
  tags: HTMLStyleElement[]
  opts: Options
  constructor(options: Options) {
    this.isSpeedy = process.env.NODE_ENV === 'production' // the big drawback here is that the css won't be editable in devtools
    this.tags = []
    this.ctr = 0
    this.opts = options
  }
  inject() {
    if (this.injected) {
      throw new Error('already injected!')
    }
    if (this.isSpeedy) {
      this.tags[0] = makeStyleTag(this.opts)
    }
    this.injected = true
  }
  speedy(bool: boolean) {
    if (this.ctr !== 0) {
      // cannot change speedy mode after inserting any rule to sheet. Either call speedy(${bool}) earlier in your app, or call flush() before speedy(${bool})
      throw new Error(`cannot change speedy now`)
    }
    this.isSpeedy = !!bool
  }
  insert(rule: string, sourceMap?: string) {
    // this is the ultrafast version, works across browsers
    if (this.isSpeedy) {
      const tag = this.tags[this.tags.length - 1]
      const sheet = sheetForTag(tag)
      try {
        sheet.insertRule(rule, sheet.cssRules.length)
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('illegal rule', rule) // eslint-disable-line no-console
        }
      }
    } else {
      const tag = makeStyleTag(this.opts)
      this.tags.push(tag)
      tag.appendChild(document.createTextNode(rule + (sourceMap || '')))
    }
    this.ctr++
    if (this.ctr % 65000 === 0) {
      this.tags.push(makeStyleTag(this.opts))
    }
  }
  flush() {
    // $FlowFixMe
    this.tags.forEach(tag => tag.parentNode.removeChild(tag))
    this.tags = []
    this.ctr = 0
    // todo - look for remnants in document.styleSheets
    this.injected = false
  }
}
