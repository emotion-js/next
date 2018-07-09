// @flow
import React from 'react'
import { Global } from '@emotion/core'
import ReactDOM from 'react-dom'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <React.Fragment>
    <App />
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
