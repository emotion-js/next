import hashString from './hash'
import StyleSheet from './sheet'
import Stylis from 'stylis'
import { createElement } from 'react'

const stylis = new Stylis()

export const sheet = new StyleSheet()

sheet.inject()

export const registered = {}

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
    stylis(`.${cls}`, thing)
    registered[cls] = thing
  }
  return cls
}

const reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|accept|acceptCharset|accessKey|action|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable)|(on[A-Z].*)|((data|aria)-.*))$/

const testOmitPropsOnStringTag = key => reactPropsRegex.test(key)
const testOmitPropsOnComponent = key => key !== 'theme' && key !== 'innerRef'

const createStyled = Component => (strings, ...interpolations) => {
  const omitFn =
    typeof Component === 'string'
      ? testOmitPropsOnStringTag
      : testOmitPropsOnComponent
  return (props, context) => {
    const getValue = v => {
      if (typeof v === 'function') {
        return v(props, context)
      }
      return v
    }
    let className = css(strings, ...interpolations.map(getValue))
    if (props.className) {
      className += ` ${props.className}`
    }

    return createElement(
      Component,
      omit(assign({}, props, { className, ref: props.innerRef }), omitFn)
    )
  }
}

function omit(
  obj: { [string]: any },
  testFn: (key: string, obj: any) => boolean
) {
  let target: { [string]: any } = {}
  let i: string
  for (i in obj) {
    if (!testFn(i, obj)) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}
const assign: any =
  Object.assign ||
  function(target) {
    let i = 1
    let length = arguments.length
    for (; i < length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

export const styled = createStyled
