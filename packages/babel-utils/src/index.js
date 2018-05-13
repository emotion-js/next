// @flow
export { getExpressionsFromTemplateLiteral } from './minify'
export { getLabelFromPath } from './label'
export { getSourceMap } from './source-maps'

export const appendStringToExpressions = (
  expressions: Array<*>,
  string: string,
  t: *
) => {
  if (!string) {
    return expressions
  }
  if (t.isStringLiteral(expressions[expressions.length - 1])) {
    expressions[expressions.length - 1].value += string
  } else {
    expressions.push(t.stringLiteral(string))
  }
  return expressions
}
