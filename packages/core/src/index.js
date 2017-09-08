import hashString from './hash'
import StyleSheet from './sheet'
import Stylis from './stylis'

const stylis = new Stylis()
const registerCacheStylis = new Stylis()

export const sheet = new StyleSheet()

sheet.inject()

export const registered = {}

export const inserted = {}

function compositionPlugin(context, content, selector, parent) {
  if (context === 1) {
    return registered[content]
  }
}

function insertionPlugin(context, content, selector, parent) {
  switch (context) {
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

stylis.use([compositionPlugin, insertionPlugin])
registerCacheStylis.use(compositionPlugin)

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

function createCss(strings, ...interpolations) {
  let thing = strings[0] || ''
  interpolations.forEach((interpolation, i) => {
    if (typeof interpolation === 'string') {
      thing += interpolation
    } else if (typeof interpolation === 'object') {
      thing += createStringFromObject(interpolation)
    }
    thing += strings[i + 1]
  })
  return thing
}

const andReplaceRegex = /&{([^}]*)}/g

export function css(...args) {
  const thing = createCss(...args)
  const hash = hashString(thing)
  const cls = `css-${hash}`
  if (registered[cls] === undefined) {
    registered[cls] = registerCacheStylis('&', thing).replace(
      andReplaceRegex,
      '$1'
    )
  }
  if (inserted[cls] === undefined) {
    stylis(`.${cls}`, thing)
    inserted[cls] = true
  }
  return cls
}

export function injectGlobal(...args) {
  const thing = createCss(...args)
  const hash = hashString(thing)
  if (inserted[hash] === undefined) {
    stylis('', thing)
    inserted[hash] = true
  }
}

export function hydrate(ids) {
  ids.forEach(id => {
    inserted[id] = true
  })
}
