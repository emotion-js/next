import React from 'react'
import Global from '@emotion/global'
import ReactDOM from 'react-dom'
// import { injectGlobal } from 'new-css-in-js'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

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
