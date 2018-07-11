// @flow
/** @jsx jsx */
import { Component } from 'react'
import styled from '@emotion/styled'
import { jsx, keyframes } from '@emotion/core'
import css from '@emotion/css'
import logo from './react.svg'

const Header = styled.header`
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

const Thing = () => (
  <div
    css={{
      color: 'hotpink',
      label: 'here-is-a-label-to-make-sure-this-is-unique'
    }}
  >
    this should always be hotpink
  </div>
)

class Home extends Component<{}, *> {
  state = { showFirstThing: true }
  componentDidMount() {
    this.setState({ showFirstThing: false })
  }
  render() {
    return (
      <div
        css={css`
          text-align: center;
        `}
      >
        <Header>
          <img
            src={logo}
            css={css`
              animation: ${animation.name} infinite 20s linear;
              height: 80px;
              ${animation.styles};
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
        {this.state.showFirstThing && <Thing />}
        <Thing />
      </div>
    )
  }
}

export default Home
