// @flow
import { parse, stringify } from 'css'

global.__TEST__ = true

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
        try {
          node.children = [
            stringify(parse(node.props.dangerouslySetInnerHTML.__html))
          ]
        } catch (e) {
          throw new Error(
            `Error parsing css: ${node.props.dangerouslySetInnerHTML.__html}`
          )
        }

        delete node.props['data-more']
        delete node.props.dangerouslySetInnerHTML
      }
    })
    return printer(val)
  }
})
