/**
 * @fileoverview JSX attributes helper
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-04 | sizhao     // initial version
 */

const t = require('@babel/types')

const { insertClassnamesSepc } = require('./import')

function getAttribute (attributes, attrName) {
  let index = -1
  const specifyAttr = attributes.find((item, i) => {
    const b = item.name.name === attrName
    if (b) {
      index = i
    }
    return b
  })

  return specifyAttr ? { index, attr: specifyAttr} : null
}

module.exports = {
  getClassName (attributes) {
    return getAttribute(attributes, 'className')
  },

  handleStringLiteral (path, { cssModules, program, classnames: {
    name, source, imported, defaultImport
  } }) {
    const { node } = path
    const { value } = node

    if (!value) {
      return
    }

    const vTokens = value.split(/\s+/)

    let expression = null
    if (vTokens.length === 1) {
      expression = t.memberExpression(cssModules, node, true)
    } else {
      const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)

      const objProps = vTokens.map(token => {
        const key = t.stringLiteral(token)
        const val = t.booleanLiteral(true)
        return t.objectProperty(key, val)
      })

      const objExp = t.objectExpression(objProps)
      const args = [cssModules, objExp]
      const callee = t.identifier(name)
      expression = t.callExpression(callee, args)
    }

    path.replaceWith(t.jsxExpressionContainer(expression))
  }
}
