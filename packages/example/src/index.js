// @jsx jsx
import { jsx } from 'new-css-in-js'
import React from 'react'
import ReactDOM from 'react-dom'
// import { injectGlobal } from 'new-css-in-js'
import App from './App'
import { Global } from 'new-css-in-js'
import registerServiceWorker from './registerServiceWorker'

// injectGlobal`
//   body {
//     margin: 0;
//     padding: 0;
//     font-family: sans-serif;
//   }
// `

ReactDOM.render(
  <React.Fragment>
    <App />
    <Global
      css={{
        body: {
          margin: 0,
          padding: 0,
          fontFamily: 'sans-serif'
        }
      }}
    />
  </React.Fragment>,
  document.getElementById('root')
)
registerServiceWorker()
