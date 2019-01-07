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

function handleTemplateElement (templateElement, begin = true) {
  const { cooked } = templateElement.value
  let reg = begin ? /\s+$/ : /^\s+/
  const tokens = cooked.trim().split(/\s+/)
  templateElement.value = {
    raw: '',
    cooked: ''
  }
  if (cooked && !reg.test(cooked)) {
    const raw = begin ? tokens.pop() : tokens.shift()
    const tEle = t.templateElement({
      raw,
      cooked: raw
    }, !begin)
    return {
      conn: true,
      element: tEle,
      restTokens: tokens
    }
  }

  return {
    conn: false,
    element: t.templateElement({
      raw: '',
      cooked: ''
    }),
    restTokens: tokens
  }
}

module.exports = {
  getClassName (attributes) {
    return getAttribute(attributes, 'className')
  },

  handleStringLiteral (path, options) {
    const { node } = path
    const { value } = node

    if (!value.trim()) {
      return
    }

    const expression = handlerString(value, options)

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

  handleTemplateLiteralExpression (path, options) {
    const { node: { expressions, quasis } } = path

    let expression = null

    if (expressions.length === 0) {
      const [ tempEle ] = quasis
      const { cooked } = tempEle.value
      if (!cooked.trim()) {
        return
      }
      expression = handlerString(cooked, options)
    } else {
      const objProps = []
      expressions.forEach((item, index) => {
        const { start, end } = item
        let connPrev = false
        let connNext = false
        const q1 = quasis[index]
        const q2 = quasis[index + 1]

        const templateElements = []
        const templateExpressions = [item]

        const propFunc = (item) => {
          if (item) {
            const key = t.stringLiteral(item)
            const val = t.booleanLiteral(true)
            objProps.push(t.objectProperty(key, val))
          }
        }
        if (q1) {
          const { element, conn, restTokens } = handleTemplateElement(q1, true)
          restTokens.forEach(propFunc)
          templateElements.push(element)
          connPrev = conn
        }

        if (q2) {
          const { element, conn, restTokens } = handleTemplateElement(q2, false)
          connNext = conn
          templateElements.push(element)
          restTokens.forEach(propFunc)
        }

        const key = (!connPrev && !connNext) ? item : t.templateLiteral(templateElements, templateExpressions)
        objProps.push(t.objectProperty(key, t.booleanLiteral(true), true))
      })

      const objExpression = t.objectExpression(objProps)
      const { program, cssModules, classnames: {
        name, source, imported, defaultImport
      } } = options
      const calleeIdent = insertClassnamesSepc(program, name, imported, source, defaultImport)
      expression = generateClassnamesCall(calleeIdent, [cssModules, objExpression])
    }

    path.replaceWith(expression)
  }
}
