declare var codegen: { $call: Function, require: string => RegExp }

const reactPropsRegex = codegen.require('./props')

export default (RegExp.prototype.test.bind(reactPropsRegex): string => boolean)
