// @flow
import { parse, stringify } from 'css'

function getNodes(node, nodes = []) {
  if (node.children) {
    node.children.forEach(child => getNodes(child, nodes))
  }
  if (Array.isArray(node)) {
    node.forEach(child => getNodes(child, nodes))
  } else if (typeof node === 'object') {
    nodes.push(node)
  }

  return nodes
}

function markNodes(nodes) {
  nodes.forEach(node => {
    node.withNewStyles = true
  })
}

const clsPattern = /css-([a-zA-Z0-9-]+)/gi

const serializer = {
  test: (val: any) => {
    if (!val) {
      return false
    }
    if (!val.withNewStyles && val.$$typeof === Symbol.for('react.test.json')) {
      return true
    } else if (
      Array.isArray(val) &&
      !val[0].withNewStyles &&
      val[0].$$typeof === Symbol.for('react.test.json')
    ) {
      return true
    }
    return false
  },
  print: (val: any, printer: Function) => {
    const nodes = getNodes(val)

    markNodes(nodes)
    let i = 0
    const classMap = {}

    nodes.forEach(node => {
      if (typeof node.props['data-more'] === 'string') {
        try {
          const replaced = node.props.dangerouslySetInnerHTML.__html.replace(
            clsPattern,
            (match, p1) => {
              if (classMap[p1] === undefined) {
                classMap[p1] = `emotion-${i++}`
              }
              return classMap[p1]
            }
          )
          // split the string by line to get correct indentation
          node.children = stringify(parse(replaced)).split('\n')
        } catch (e) {
          throw new Error(
            `Error parsing css: ${node.props.dangerouslySetInnerHTML.__html}`
          )
        }

        delete node.props['data-more']
        delete node.props.dangerouslySetInnerHTML
      }
    })
    nodes.forEach(node => {
      if (typeof node.props.className === 'string') {
        node.props.className = node.props.className.replace(
          clsPattern,
          (match, p1) => {
            if (classMap[p1] !== undefined) {
              return classMap[p1]
            }
            return match
          }
        )
      }
    })
    return printer(val)
  }
}

export default serializer
