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

  return specifyAttr ? { index, attr: specifyAttr } : null
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
    expression = generateClassnamesCall(calleeIdent, [ cssModules, objExp ])
  }

  return expression
}

module.exports = {
  getAttribute,

  handleStringLiteral (path, options) {
    const { node } = path
    const { value } = node

    if (!value.trim()) {
      return
    }

    const expression = handlerString(value, options)

    path.replaceWith(path.parentPath.isJSXExpressionContainer() ? expression : t.jsxExpressionContainer(expression))
  },

  handleObjectExpression (path, {
    program, cssModules, classnames: {
      name, source, imported, defaultImport
    }
  }) {
    const { node } = path

    const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)
    const expression = generateClassnamesCall(calleeIdent, [ cssModules, node ])
    path.replaceWith(expression)
  },

  handleTemplateLiteralExpression (path, options, handleWithExpression = false) {
    const { node: { expressions, quasis } } = path

    let expression = path.node

    if (expressions.length === 0) {
      const [ tempEle ] = quasis
      const { cooked } = tempEle.value
      if (!cooked.trim()) {
        return
      }
      expression = handlerString(cooked, options)
    } else if (handleWithExpression) {
      const objProps = []

      const quasisStr = quasis.map(item => {
        const { cooked } = item.value
        return cooked
      })

      const fakeClassNames = quasisStr.join('{@}').split(/\s+/)

      fakeClassNames.forEach(v => {
        if (!/\{@\}/.test(v)) {
          const key = t.stringLiteral(v)
          const val = t.booleanLiteral(true)
          objProps.push(t.objectProperty(key, val))
        } else if (/^\{@\}$/.test(v)) {
          objProps.push(t.objectProperty(expressions.shift(), t.booleanLiteral(true), true))
        } else {
          const tele = []
          const texp = []
          const vts = v.split(/[{}]/)
          vts.forEach((vt, index) => {
            if (vt !== '@') {
              tele.push(
                t.templateElement({
                  raw: vt,
                  cooked: vt
                }, index === (vts.length - 1))
              )
            } else {
              texp.push(expressions.shift())
            }
          })
          objProps.push(t.objectProperty(t.templateLiteral(tele, texp), t.booleanLiteral(true), true))
        }
      })

      const objExpression = t.objectExpression(objProps)
      const { program, cssModules, classnames: {
        name, source, imported, defaultImport
      } } = options
      const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)
      expression = generateClassnamesCall(calleeIdent, [ cssModules, objExpression ])
    }

    path.replaceWith(expression)
  }
}
