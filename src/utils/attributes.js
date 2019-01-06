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

function generateClassnamesCall (funcName, args) {
  const callee = t.identifier(funcName)
  return t.callExpression(callee, args)
}

function handlerString (str, {
  program, cssModules, classnames: {
    name, source, imported, defaultImport
  }
}) {
  const vTokens = str.trim().split(/\s+/)

  let expression = null
  if (vTokens.length === 1) {
    expression = t.memberExpression(cssModules, t.stringLiteral(str), true)
  } else {
    const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)

    const objProps = vTokens.map(token => {
      const key = t.stringLiteral(token)
      const val = t.booleanLiteral(true)
      return t.objectProperty(key, val)
    })

    const objExp = t.objectExpression(objProps)
    expression = generateClassnamesCall(calleeIdent, [cssModules, objExp])
  }

  return expression
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

    const expression = handlerString(value, {
      cssModules, program, classnames: {
        name, source, imported, defaultImport
      }
    })

    path.replaceWith(path.parentPath.isJSXExpressionContainer () ? expression : t.jsxExpressionContainer(expression))
  },

  handleObjectExpression (path, {
    program, cssModules, classnames: {
      name, source, imported, defaultImport
    }
  }) {
    const { node } = path

    const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)
    const expression = generateClassnamesCall(calleeIdent, [cssModules, node])
    path.replaceWith(expression)
  },

  handleTemplateLiteralExpression (path, {
    program,
    cssModules,
    classnames: {
      name, source, imported, defaultImport
    }
  }) {
    const { node: { expressions, quasis } } = path

    let expression = null
    if (expressions.length === 0) {
      const [ tempEle ] = quasis
      const { cooked } = tempEle.value
      if (!cooked) {
        return
      }
      expression = handlerString(cooked, {
        program, cssModules, classnames: {
          name, source, imported, defaultImport
        }
      })
    } else {

    }

    path.replaceWith(expression)
  }
}
