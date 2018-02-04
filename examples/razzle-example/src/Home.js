// @flow
// @jsx jsx
import React, { Component } from 'react'
import { styled, css, jsx, Global, Keyframes, keyframes } from 'new-css-in-js'
import logo from './react.svg'

const Header = styled('header')`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`

const animation = keyframes(css`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`)

class Home extends Component<{}> {
  render() {
    return (
      <div
        css={css`
          text-align: center;
        `}
      >
        <Header>
          <Keyframes keyframes={animation} />
          <img
            src={logo}
            css={css`
              animation: ${animation} infinite 20s linear;
              height: 80px;
            `}
            alt="logo"
          />

          <h2>Welcome to Razzle</h2>
        </Header>
        <p css={{ fontSize: 'large' }}>
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul
          css={css`
            list-style: none;

            & > li {
              display: inline-block;
              padding: 1rem;
            }
          `}
        >
          <li>
            <a href="https://github.com/jaredpalmer/razzle">Docs</a>
          </li>
          <li>
            <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
          </li>
          <li>
            <a href="https://palmer.chat">Community Slack</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Home
