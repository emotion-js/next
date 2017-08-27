import hashString from './hash'
import StyleSheet from './sheet'
import Stylis from 'stylis'

// internal utils that should only be used internally
export * from './utils'

const stylis = new Stylis()

export const sheet = new StyleSheet()

sheet.inject()

export const registered = {}

export const inserted = {}

function plugin(context, content, selector, parent) {
  switch (context) {
    // on property declaration
    case 1:
      return registered[content]
    // after a selector block
    case 2: {
      if (parent.length !== 0 && parent[0] === selector[0]) {
        break
      }
    }
    // after an at rule block
    case 3: // eslint-disable-line no-fallthrough
      sheet.insert(`${selector.join(',')}{${content}}`)
  }
}

stylis.use(plugin)

const hyphenateRegex = /[A-Z]|^ms/g

function flatten(inArr) {
  let arr = []
  inArr.forEach(val => {
    if (Array.isArray(val)) arr = arr.concat(flatten(val))
    else arr = arr.concat(val)
  })

  return arr
}

function handleInterpolation(interpolation) {
  if (typeof interpolation === 'object') {
    return createStringFromObject(interpolation)
  }
  return interpolation
}

function createStringFromObject(obj) {
  let string = ''

  if (Array.isArray(obj)) {
    flatten(obj).forEach(interpolation => {
      string += handleInterpolation(interpolation)
    })
  } else {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        string += `${key.replace(hyphenateRegex, '-$&').toLowerCase()}:${obj[
          key
        ]};`
      } else {
        string += `${key}{${createStringFromObject(obj[key])}}`
      }
    })
  }
  return string
}

export function css(strings, ...interpolations) {
  let thing = strings[0] || ''
  interpolations.forEach((interpolation, i) => {
    if (typeof interpolation === 'string') {
      thing += interpolation
    } else if (typeof interpolation === 'object') {
      thing += createStringFromObject(interpolation)
    }
    thing += strings[i + 1]
  })
  const hash = hashString(thing)
  const cls = `css-${hash}`
  if (registered[cls] === undefined) {
    registered[cls] = thing
  }
  if (inserted[cls] === undefined) {
    stylis(`.${cls}`, thing)
  }
  return cls
}
