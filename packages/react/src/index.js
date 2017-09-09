import { createElement } from 'react'
import { css, memoize } from 'new-css-in-js'

export * from 'new-css-in-js'

// use babel-plugin-codegen to make this later
const reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|accept|acceptCharset|accessKey|action|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable)|(on[A-Z].*)|((data|aria)-.*))$/

const testOmitPropsOnStringTag = memoize(key => reactPropsRegex.test(key))
const testOmitPropsOnComponent = key => key !== 'theme' && key !== 'innerRef'

const omitAssign = function(testFn, target) {
  let i = 2
  let length = arguments.length
  for (; i < length; i++) {
    let source = arguments[i]
    let key
    for (key in source) {
      if (testFn(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

export default function(tag) {
  return (initialStrings, ...initialInterpolations) => {
    const baseTag = tag.__emotion_base || tag

    const omitFn =
      typeof baseTag === 'string'
        ? testOmitPropsOnStringTag
        : testOmitPropsOnComponent
    const strings =
      tag.__emotion_strings !== undefined
        ? tag.__emotion_strings.concat(initialStrings)
        : initialStrings
    const interpolations =
      tag.__emotion_interp !== undefined
        ? tag.__emotion_interp.concat([';'], initialInterpolations)
        : initialInterpolations
    const Styled = (props, context) => {
      let className = ''
      let classInterpolations = ''
      if (props.className) {
        const classes = props.className.split(' ')
        classes.forEach(splitClass => {
          if (splitClass.indexOf('css-') === 0) {
            classInterpolations += `${splitClass};`
          } else {
            className += `${splitClass} `
          }
        })
      }
      let newInterpolations = interpolations
      let newStrings = strings
      if (classInterpolations) {
        newInterpolations = newInterpolations.concat([''])
        newStrings = newStrings.concat([classInterpolations])
      }
      className += css(
        newStrings,
        ...newInterpolations.map(v => {
          if (typeof v === 'function') {
            return v(props, context)
          }
          return v
        })
      )
      return createElement(
        baseTag,
        omitAssign(omitFn, {}, props, { className, ref: props.innerRef })
      )
    }
    Styled.__emotion_strings = strings
    Styled.__emotion_interp = interpolations
    Styled.__emotion_base = baseTag
    return Styled
  }
}
