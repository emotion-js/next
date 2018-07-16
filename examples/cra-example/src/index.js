// @flow
/** @jsx jsx */
import Provider from '@emotion/provider'
import { jsx } from '@emotion/core'
import React from 'react'
import { Global } from '@emotion/core'
import ReactDOM from 'react-dom'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'

class ThemeTest extends React.Component<*, *> {
  state = { theme: { color: 'hotpink', margin: 4 } }
  render() {
    return (
      <Provider theme={this.state.theme}>
        <button
          id="the-thing"
          onClick={() => {
            this.setState({ theme: { color: 'green', margin: 8 } })
          }}
          css={({ color, margin }) => ({
            color,
            margin
          })}
        >
          something
        </button>
      </Provider>
    )
  }
}

ReactDOM.render(
  <React.Fragment>
    <App />
    <ThemeTest />
    <Global
      styles={{
        body: {
          margin: 0,
          padding: 0,
          fontFamily: 'sans-serif'
        }
      }}
    />
  </React.Fragment>,
  // $FlowFixMe
  document.getElementById('root')
)
// registerServiceWorker()
