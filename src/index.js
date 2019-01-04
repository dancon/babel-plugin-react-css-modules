/**
 * @fileoverview babel-plugin-react-css-modules
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-03 | sizhao         // initial version
 */

const p = require('path')
const babelPluginSyntaxJSX = require('@babel/plugin-syntax-jsx')

const { getClassName } = require('./utils/attributes')
const { insertClassnamesSepc } = require('./utils/import')
let { CLASSNAMES, CLASSNAMESOURCE, DEFAULTCSSMODULES } = require('./utils/constant')
let CLASSNAMEIMPORTDEFAULT = true
let conflictCls = ''

module.exports = function (babel) {
  const { types: t } = babel
  let cssModules = t.identifier(DEFAULTCSSMODULES)

  return {
    inherits: babelPluginSyntaxJSX.default,
    visitor: {
      ImportDeclaration (path, state) {
        const { node: { specifiers, source } } = path

        if (!/\.(?:less|css|s[ac]ss)$/i.test(source.value)) {
          return
        }

        if (specifiers.length === 0) {
          const defaultSpec = t.importDefaultSpecifier(cssModules)
          const imptDec = t.importDeclaration([defaultSpec], source)
          path.replaceWith(imptDec)
          return
        }

        if (specifiers.length === 1) {
          const [ spec ] = specifiers
          const { local } = spec
          cssModules = local
        }
      },

      JSXElement (path) {
        const { node } = path
        const { attributes } = node.openingElement
        const attr = getClassName(attributes)

        const program = path.findParent(path => path.isProgram())

        if (attr) {
          const { index, attr: className } = attr

          if (className && className.value.type === 'StringLiteral') {
            const { value } = className.value
            if (!value) {
              return
            }
            const vTokens = value.split(' ')

            let classNameVal = null
            if (vTokens.length === 1) {
              classNameVal = t.memberExpression(cssModules, className.value, true)
            } else {
              CLASSNAMES = insertClassnamesSepc(program, CLASSNAMES, CLASSNAMESOURCE, CLASSNAMEIMPORTDEFAULT, conflictCls)

              const valueObjProps = vTokens.map(token => {
                const key = t.stringLiteral(token)
                const val = t.booleanLiteral(true)
                return t.objectProperty(key, val)
              })

              const valueObj = t.objectExpression(valueObjProps)
              const args = [cssModules, valueObj]
              const callee = t.identifier(conflictCls ? conflictCls : CLASSNAMES)
              classNameVal = t.callExpression(callee, args)
            }

            className.value = t.jSXExpressionContainer(classNameVal)
            attributes.splice(index, 1, className)
            node.openingElement.attributes = attributes
          }
        }

        path.replaceWith(node)
      },

      Program (path, state) {
        const { opts: { classnames }, filename, cwd } = state

        if (classnames) {
          let { name, source, default: df = true } = classnames

          if (name) {
            CLASSNAMES = name
          }

          if (source) {
            if (/^[./]/.test(source)) {
              source = p.relative(p.dirname(filename), p.resolve(cwd, source))
            }
            CLASSNAMESOURCE = source
          }

          CLASSNAMEIMPORTDEFAULT = df
        }

        if (path.scope.hasBinding(CLASSNAMES)) {
          const uniqIdenti = path.scope.generateUidIdentifier(CLASSNAMES)
          conflictCls = uniqIdenti.name
        }

        if (path.scope.hasBinding(DEFAULTCSSMODULES)) {
          cssModules = path.scope.generateUidIdentifier(DEFAULTCSSMODULES)
        }
      }
    }
  }
}
