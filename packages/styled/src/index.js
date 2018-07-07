// @flow
import styled from '@emotion/styled-base'

declare var codegen: Function

const tags = codegen`
const htmlTagNames = require('html-tag-names')
const svgTagNames = require('svg-tag-names')
module.exports = JSON.stringify(htmlTagNames
.concat(svgTagNames)
.filter((tag, index, array) => array.indexOf(tag) === index))
`

// bind it to avoid mutating the original function
const newStyled = styled.bind(undefined)

tags.forEach(tagName => {
  newStyled[tagName] = newStyled(tagName)
})

export default newStyled
