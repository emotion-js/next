// @flow
/** @jsx jsx */
import 'test-utils/no-test-mode'
import * as React from 'react'
import Provider from '@emotion/provider'
import jsx from '@emotion/jsx'
import { render } from 'react-dom'

test('provider with theme value that changes', () => {
  class ThemeTest extends React.Component<*, *> {
    state = { theme: { color: 'hotpink', padding: 4 } }
    render() {
      return (
        <Provider theme={this.state.theme}>
          <div
            id="the-thing"
            onClick={() => {
              this.setState({ theme: { color: 'hotpink', padding: 8 } })
            }}
            css={({ color, padding }) => ({
              color,
              padding
            })}
          />
        </Provider>
      )
    }
  }
  // $FlowFixMe
  document.head.innerHTML = ''
  // $FlowFixMe
  document.body.innerHTML = '<div id="root"></div>'
  // $FlowFixMe
  render(<ThemeTest />, document.getElementById('root'))
  expect(document.querySelector('html')).toMatchSnapshot()
  // $FlowFixMe
  document.getElementById('the-thing').click()
  expect(document.querySelector('html')).toMatchSnapshot()
  // $FlowFixMe
  document.head.innerHTML = ''
  // $FlowFixMe
  document.body.innerHTML = '<div id="root"></div>'
})
