// @flow
// @jsx jsx
import * as React from 'react'
import { jsx, css } from 'new-css-in-js'
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

// $FlowFixMe
expect.addSnapshotSerializer({
  test: val =>
    val && !val.withNewStyles && val.$$typeof === Symbol.for('react.test.json'),
  print: (val, printer) => {
    const nodes = getNodes(val)
    markNodes(nodes)
    nodes.forEach(node => {
      if (typeof node.props['data-more'] === 'string') {
        node.children = [
          stringify(parse(node.props.dangerouslySetInnerHTML.__html))
        ]
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
