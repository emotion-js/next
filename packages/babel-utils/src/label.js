// @flow
export function getLabelFromPath(path: *, t: *) {
  return getIdentifierName(path, t)
}

function getDeclaratorName(path, t) {
  // $FlowFixMe
  const parent = path.findParent(p => p.isVariableDeclarator())
  return parent && t.isIdentifier(parent.node.id) ? parent.node.id.name : ''
}

function getIdentifierName(path, t) {
  let classParent
  if (path) {
    // $FlowFixMe
    classParent = path.findParent(p => t.isClass(p))
  }
  if (classParent && classParent.node.id) {
    return t.isIdentifier(classParent.node.id) ? classParent.node.id.name : ''
  } else if (
    classParent &&
    classParent.node.superClass &&
    classParent.node.superClass.name
  ) {
    return `${getDeclaratorName(path, t)}(${classParent.node.superClass.name})`
  }

  return getDeclaratorName(path, t)
}
