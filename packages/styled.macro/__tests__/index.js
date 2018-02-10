// @flow
import cases from 'jest-in-case'
import * as babel from '@babel/core'

const separator = '\n\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n'

cases(
  '@emotion/styled.macro',
  opts => {
    const { code } = babel.transformSync(opts.code, {
      plugins: ['macros'],
      babelrc: false,
      filename: __filename
    })
    expect(`${opts.code}${separator}${code}`).toMatchSnapshot()
  },
  {
    basic: {
      code: `import styled from '@emotion/styled.macro'
    const SomeComponent = styled.div\`color: hotpink;\``
    },
    callExpression: {
      code: `import styled from '@emotion/styled.macro'
      const SomeComponent = styled('div')\`color: hotpink;\``
    }
  }
)
