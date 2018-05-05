// @flow
import * as React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Home from './Home'
import { Global } from '@emotion/core'
import css from '@emotion/css'

const App = () => (
  <React.Fragment>
    <Global
      css={css`
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
        }
      `}
    />
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </React.Fragment>
)

export default App
