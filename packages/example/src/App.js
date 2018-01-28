// @flow
// @jsx jsx
import React, { Component } from 'react'
import { jsx } from 'new-css-in-js'
import logo from './logo.svg'

// fontFace`
// font-family: 'Oxygen';
// font-style: normal;
// font-weight: 400;
// src: local('Oxygen Regular'), local('Oxygen-Regular'), url(https://fonts.gstatic.com/s/oxygen/v6/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2) format('woff2');
// unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
// `

// const logoSpin = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `

// const Header = styled('div')`
//   font-family: 'Oxygen', sans-serif;
//   background-color: #222;
//   height: 150px;
//   padding: 20px;
//   color: white;
//   &:hover {
//     color: hotpink;
//   }
// `

// const Logo = styled('img')`
//   animation: ${logoSpin} infinite 20s linear;
//   height: 80px;
// `

class App extends Component<{}> {
  render() {
    return (
      <div css={{ textAlign: 'center' }}>
        <header
          css={{
            fontFamily: "'Oxygen', sans-serif",
            backgroundColor: '#222',
            height: 150,
            padding: 20,
            color: 'white',
            ':hover': {
              color: 'hotpink'
            }
          }}
        >
          <img css={{ height: 80 }} src={logo} alt="logo" />
          <h2>Welcome to React</h2>
        </header>
        <p css={{ fontSize: 'large' }}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
