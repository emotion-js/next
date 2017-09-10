import React, { Component } from 'react'
import styled, { fontFace, keyframes } from 'react-new-css-in-js'
import logo from './logo.svg'

fontFace`
font-family: 'Oxygen';
font-style: normal;
font-weight: 400;
src: local('Oxygen Regular'), local('Oxygen-Regular'), url(https://fonts.gstatic.com/s/oxygen/v6/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2) format('woff2');
unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
`

const logoSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Container = styled('div')`text-align: center;`

const Header = styled('div')`
  font-family: 'Oxygen', sans-serif;
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
  &:hover {
    color: hotpink;
  }
`

const Logo = styled('img')`
  animation: ${logoSpin} infinite 20s linear;
  height: 80px;
`

const Intro = styled('p')`font-size: large;`

class App extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Logo src={logo} alt="logo" />
          <h2>Welcome to React</h2>
        </Header>
        <Intro>
          To get started, edit <code>src/App.js</code> and save to reload.
        </Intro>
      </Container>
    )
  }
}

export default App
