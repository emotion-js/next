// @flow
import { memoize } from 'emotion-utils'

export type Interpolations = Array<any>

declare var codegen: { $call: Function, require: string => RegExp }

export const tags = codegen`

const htmlTagNames = require('html-tag-names')
const svgTagNames = require('svg-tag-names')

module.exports = JSON.stringify(htmlTagNames
.concat(svgTagNames)
.filter((tag, index, array) => array.indexOf(tag) === index))`

const reactPropsRegex = codegen.require('./props')
export const testOmitPropsOnStringTag: (key: string) => boolean = memoize(key =>
  reactPropsRegex.test(key)
)
export const testOmitPropsOnComponent = (key: string) =>
  key !== 'theme' && key !== 'innerRef'
export const testAlwaysTrue = () => true

export const omitAssign: (
  testFn: (key: string) => boolean,
  target: {},
  ...sources: Array<{}>
) => Object = function(testFn, target) {
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

export type StyledOptions = { label: string }

type CreateStyledComponent = (...args: Interpolations) => *

type BaseCreateStyled = (
  tag: any,
  options?: StyledOptions
) => CreateStyledComponent

export type CreateStyled = {
  $call: BaseCreateStyled,
  [key: string]: CreateStyledComponent
}
