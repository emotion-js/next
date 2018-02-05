// @flow
// @jsx jsx
import * as React from 'react'
import { jsx, css, Style, keyframes, Global } from 'new-css-in-js'
import renderer from 'react-test-renderer'
import { parse, stringify } from 'css'

function getNodes(node, nodes = []) {
  if (node.children) {
    node.children.forEach(child => getNodes(child, nodes))
  }

  if (typeof node === 'object') {
    nodes.push(node)
  }

  return nodes
}

function markNodes(nodes) {
  nodes.forEach(node => {
    node.withNewStyles = true
  })
}

// this still needs to replace hashes
// $FlowFixMe
expect.addSnapshotSerializer({
  test: val =>
    val && !val.withNewStyles && val.$$typeof === Symbol.for('react.test.json'),
  print: (val, printer) => {
    const nodes = getNodes(val)
    markNodes(nodes)
    nodes.forEach(node => {
      if (typeof node.props['data-more'] === 'string') {
        // this is probably doable without a snapshot serializer
        node.children = [
          stringify(parse(node.props.dangerouslySetInnerHTML.__html))
        ]
        delete node.props['data-more']
        delete node.props.dangerouslySetInnerHTML
      }
    })
    return printer(val)
  }
})

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
