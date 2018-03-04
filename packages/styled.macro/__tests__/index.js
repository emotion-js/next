// @flow
import tester from 'macro-tester'

tester('@emotion/styled.macro', {
  basic: {
    code: `import styled from '@emotion/styled.macro'
    const SomeComponent = styled.div\`color: hotpink;\``
  },
  callExpression: {
    code: `import styled from '@emotion/styled.macro'
      const SomeComponent = styled('div')\`color: hotpink;\``
  }
})
