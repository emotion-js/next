function last(arr) {
  return arr[arr.length - 1]
}

function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet
  }

  // this weirdness brought to you by firefox
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i]
    }
  }
}

const isBrowser: boolean = typeof window !== 'undefined'
const isDev: boolean = process.env.NODE_ENV !== 'production'

function makeStyleTag() {
  let tag = document.createElement('style')
  tag.type = 'text/css'
  tag.setAttribute('data-new-css-in-js', '')
  tag.appendChild(document.createTextNode(''))
  document.head.appendChild(tag)
  return tag
}

export default class StyleSheet {
  constructor(speedy = !isDev) {
    this.isSpeedy = speedy // the big drawback here is that the css won't be editable in devtools
    this.sheet = undefined
    this.tags = []
    this.maxLength = 65000
    this.ctr = 0
  }
  getSheet() {
    return sheetForTag(last(this.tags))
  }
  inject() {
    if (this.injected) {
      throw new Error('already injected!')
    }
    if (isBrowser) {
      this.tags[0] = makeStyleTag()
    } else {
      // server side 'polyfill'. just enough behavior to be useful.
      this.sheet = {
        cssRules: [],
        insertRule: rule => {
          // enough 'spec compliance' to be able to extract the rules later
          // in other words, just the cssText field
          this.sheet.cssRules.push({ cssText: rule })
        }
      }
    }
    this.injected = true
  }
  speedy(bool) {
    if (this.ctr !== 0) {
      // cannot change speedy mode after inserting any rule to sheet. Either call speedy(${bool}) earlier in your app, or call flush() before speedy(${bool})
      throw new Error(`cannot change speedy now`)
    }
    this.isSpeedy = !!bool
  }
  _insert(rule) {
    // this weirdness for perf, and chrome's weird bug
    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
    let sheet = this.getSheet()
    sheet.insertRule(rule, sheet.cssRules.length)
  }
  insert(rule) {
    if (isBrowser) {
      // this is the ultrafast version, works across browsers
      if (this.isSpeedy && this.getSheet().insertRule) {
        this._insert(rule)
      } else {
        // more browser weirdness. I don't even know
        // else if(this.tags.length > 0 && this.tags::last().styleSheet) {
        //   this.tags::last().styleSheet.cssText+= rule
        // }
        last(this.tags).appendChild(document.createTextNode(rule))
      }
    } else {
      // server side is pretty simple
      this.sheet.insertRule(rule)
    }

    this.ctr++
    if (isBrowser && this.ctr % this.maxLength === 0) {
      this.tags.push(makeStyleTag())
    }
    return this.ctr - 1
  }
  flush() {
    if (isBrowser) {
      this.tags.forEach(tag => tag.parentNode.removeChild(tag))
      this.tags = []
      this.sheet = null
      this.ctr = 0
      // todo - look for remnants in document.styleSheets
    } else {
      // simpler on server
      this.sheet.cssRules = []
    }
    this.injected = false
  }
}
