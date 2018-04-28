// @flow
/** @jsx jsx */
import 'test-utils/no-test-mode'
import jsx from '@emotion/jsx'
import { render } from 'react-dom'
import * as emotion from 'emotion'
import { css } from 'emotion'
import Provider from '@emotion/provider'
import createCompatCache from '@emotion/compat-cache'

const cache = createCompatCache(emotion)

test('composition works from old emotion css calls', cb => {
  const cls = css`
    color: green;
  `
  render(
    <Provider cache={cache}>
      <div css={cls} />
    </Provider>,
    // $FlowFixMe
    document.body,
    () => {
      expect(document.querySelector('html')).toMatchSnapshot()
      cb()
    }
  )
})
