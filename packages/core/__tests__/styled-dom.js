// @flow
import ReactDOM from 'react-dom'
import React from 'react'
import styled from '@emotion/styled'

test('ref', () => {
  const H1 = styled.h1`
    font-size: 12px;
  `
  let node
  // $FlowFixMe
  document.body.innerHTML = `<div id="app"></div>`

  ReactDOM.render(
    <H1
      ref={val => {
        node = val
      }}
      id="thing"
    >
      hello world
    </H1>,
    // $FlowFixMe
    document.getElementById('app')
  )
  expect(node).toBe(document.getElementById('thing'))
  ReactDOM.unmountComponentAtNode(document.getElementById('app'))
})
