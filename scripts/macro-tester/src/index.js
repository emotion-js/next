// @flow
import jestInCase from 'jest-in-case'
import * as babel from '@babel/core'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

const separator = '\n\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n'

const tester = async opts => {
  let rawCode = opts.code
  if (!opts.code && opts.filename) {
    rawCode = await readFile(opts.filename, 'utf-8')
  }
  const { code } = babel.transformSync(rawCode, {
    plugins: ['macros', '@babel/plugin-syntax-jsx'],
    babelrc: false,
    filename: opts.filename || __filename
  })

  expect(`${rawCode}${separator}${code}`).toMatchSnapshot()
}

function doThing(dirname) {
  const fixturesFolder = path.join(dirname, '__fixtures__')
  return fs
    .readdirSync(fixturesFolder)
    .map(base => path.join(fixturesFolder, base))
}

export default (
  name: string,
  cases:
    | {
        [key: string]: {
          code: string
        }
      }
    | string
) => {
  if (typeof cases === 'string') {
    cases = doThing(cases).reduce((accum, filename) => {
      accum[path.parse(filename).name] = { filename }
      return accum
    }, {})
  }

  // $FlowFixMe
  return jestInCase(name, tester, cases)
}
