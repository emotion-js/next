/**
 * @jest-environment node
 */
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { JSDOM } from 'jsdom'

function getStuff() {
  return {
    Global: require('@emotion/core').Global,
    styled: require('@emotion/styled')
  }
}

function getElement() {
  const { styled, Global } = getStuff()
  let SomeComponent = styled.p`
    color: hotpink;
  `
  return (
    <div>
      <Global
        css={{
          '.some-class': {
            color: 'green'
          }
        }}
      />
      {/* this should be hotpink */}
      <SomeComponent id="text" className="some-class">
        some text
      </SomeComponent>
    </div>
  )
}

test('specificity with globals', () => {
  let html = renderToString(getElement())
  expect(html).toMatchInlineSnapshot()

  let { window } = new JSDOM(`<div id="root">${html}</div>`)
  global.window = window
  global.document = window.document
  expect(document.documentElement).toMatchInlineSnapshot()
  jest.resetModules()
})
