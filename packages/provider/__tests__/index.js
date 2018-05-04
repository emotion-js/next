// @flow
/** @jsx jsx */
import Provider from '@emotion/provider'
import { jsx } from '@emotion/core'
import renderer from 'react-test-renderer'
import createCache from '@emotion/cache'
import { CSSContext } from '@emotion/core'

test('nested provider', () => {
  const tree = renderer
    .create(
      <Provider theme={{ color: 'hotpink', padding: 4 }}>
        <Provider theme={{ backgroundColor: 'darkgreen', color: 'white' }}>
          <div
            css={({ color, padding, backgroundColor }) => ({
              color,
              padding,
              backgroundColor
            })}
          />
        </Provider>
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('nested provider with function', () => {
  const tree = renderer
    .create(
      <Provider theme={{ color: 'hotpink', padding: 4 }}>
        <Provider
          theme={theme => ({
            backgroundColor: 'darkgreen',
            ...theme,
            padding: 8
          })}
        >
          <div
            css={({ color, padding, backgroundColor }) => ({
              color,
              padding,
              backgroundColor
            })}
          />
        </Provider>
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

test('nested provider with function that does not return a function throws the correct error', () => {
  expect(() => {
    renderer
      .create(
        <Provider theme={{ color: 'hotpink', padding: 4 }}>
          <Provider theme={theme => undefined}>
            <div
              css={({ color, padding, backgroundColor }) => ({
                color,
                padding,
                backgroundColor
              })}
            />
          </Provider>
        </Provider>
      )
      .toJSON()
  }).toThrowErrorMatchingSnapshot()
})

test('nested provider with theme value that is not a plain object throws', () => {
  expect(() => {
    renderer
      .create(
        <Provider theme={{ color: 'hotpink', padding: 4 }}>
          {/* $FlowFixMe */}
          <Provider theme>
            <div
              css={({ color, padding, backgroundColor }) => ({
                color,
                padding,
                backgroundColor
              })}
            />
          </Provider>
        </Provider>
      )
      .toJSON()
  }).toThrowErrorMatchingSnapshot()
})

test('allow passing a cache', () => {
  const cache = createCache()
  const tree = renderer
    .create(
      <Provider cache={cache}>
        <CSSContext.Consumer>
          {context => {
            expect(context).toBe(cache)
            return null
          }}
        </CSSContext.Consumer>
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
