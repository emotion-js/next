// @flow
// @jsx jsx
import * as React from 'react'
import { jsx, css, Style, keyframes, Global, Dynamic } from 'new-css-in-js'
import renderer from 'react-test-renderer'

test('thing', () => {
  const tree = renderer.create(
    <div>
      <div css={{ display: 'flex' }}>something</div>
    </div>
  )

  expect(tree.toJSON()).toMatchSnapshot()
})

test('css call to render', () => {
  const cls = css`
    color: green;
  `
  const tree = renderer.create(
    <div>
      <Style styles={cls} />
      <div className={cls.toString()}>something</div>
    </div>
  )

  expect(tree.toJSON()).toMatchSnapshot()
})

test('keyframes', () => {
  const animation = keyframes(css`
    from {
      color: green;
    }
    to {
      color: hotpink;
    }
  `)
  const tree = renderer.create(
    <div>
      <Style styles={animation} />
      <div>{animation.toString()}</div>
    </div>
  )

  expect(tree.toJSON()).toMatchSnapshot()
})

test('global', () => {
  const tree = renderer.create(
    <div>
      <Global
        css={css`
          body {
            color: hotpink;
          }
        `}
      />
    </div>
  )

  expect(tree.toJSON()).toMatchSnapshot()
})

test('dynamic', () => {
  const tree = renderer.create(
    <div>
      <Dynamic
        css={css`
          color: hotpink;
        `}
        render={className => <div className={className} />}
      />
    </div>
  )

  expect(tree.toJSON()).toMatchSnapshot()
})
