// @flow
/** @jsx jsx */
import * as React from 'react'
import jsx from '@emotion/jsx'
import Style from '@emotion/style'
import Global from '@emotion/global'
import css from '@emotion/css'
import keyframes from '@emotion/keyframes'
import styled from '@emotion/styled.macro'
import logo from './logo.svg'

const headerStyle = css`
  font-family: 'Oxygen', sans-serif;
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
  &:hover {
    color: hotpink;
  }
`

const animation = keyframes(css`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`)

const Container = styled.div`
  text-align: ${props => props.align};
`

const Logo = styled.img`
  animation: ${props => props.animation} infinite 20s linear;
  height: 80px;
`

class App extends React.Component<{}> {
  render() {
    return (
      <Container align="center">
        <Global
          css={css`
            @font-face {
              font-family: 'Oxygen';
              font-style: normal;
              font-weight: 400;
              src: local('Oxygen Regular'), local('Oxygen-Regular'),
                url(https://fonts.gstatic.com/s/oxygen/v6/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)
                  format('woff2');
              unicode-range: U+0000-00ff, U+0131, U+0152-0153, U+02c6, U+02da,
                U+02dc, U+2000-206f, U+2074, U+20ac, U+2212, U+2215;
            }
          `}
        />
        <Style styles={[animation, headerStyle]} />
        <div css={headerStyle}>
          <Logo
            animation={animation}
            css={{ height: 80 }}
            src={logo}
            alt="logo"
          />

          <h2>Welcome to React</h2>
        </div>
        <p css={{ fontSize: 'large' }}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </Container>
    )
  }
}

export default App
