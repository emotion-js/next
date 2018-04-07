import memoize from '@emotion/memoize'

declare var codegen: { $call: Function, require: string => RegExp }

const reactPropsRegex = codegen.require('./props')

export default (memoize(
  RegExp.prototype.test.bind(reactPropsRegex)
): string => boolean)
