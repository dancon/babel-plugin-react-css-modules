/**
 * @fileoverview babel-plugin-react-css-modules
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-03 | sizhao         // initial version
 */

const p = require('path')
const babelPluginSyntaxJSX = require('@babel/plugin-syntax-jsx')

const {
  getAttribute,
  handleStringLiteral,
  handleObjectExpression,
  handleTemplateLiteralExpression
} = require('./utils/attributes')
const { insertClassnamesSepc } = require('./utils/import')
let { CLASSNAMES, CLASSNAMESOURCE, DEFAULTCSSMODULES } = require('./utils/constant')
let CLASSNAMEIMPORTDEFAULT = true
let conflictCls = ''
let program = null

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

      JSXAttribute (path) {
        const { node } = path
        const { name } = node.name
        if (!/^className$/.test(name)) {
          return
        }

        const classnames = {
          name: conflictCls ? conflictCls : CLASSNAMES,
          source: CLASSNAMESOURCE,
          imported: CLASSNAMES,
          defaultImport: CLASSNAMEIMPORTDEFAULT
        }

        path.traverse({
          StringLiteral (path) {
            if (path.parentPath.isJSXAttribute()
              || (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXAttribute())) {
              handleStringLiteral(path, {
                cssModules,
                program,
                classnames
              })
            }
          },

          ObjectExpression (path) {
            if (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXAttribute()) {
              handleObjectExpression(path, {
                program,
                cssModules,
                classnames
              })
            }
          },

          TemplateLiteral (path) {
            if (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXAttribute()) {
              handleTemplateLiteralExpression(path, {
                program,
                cssModules,
                classnames
              })
            }
          }
        })
      },

      JSXElement: {
        exit (path) {
          const { node } = path
          const { attributes } = node.openingElement

          const className = getAttribute(attributes, 'className')
          const styleName = getAttribute(attributes, 'styleName')

          const name = conflictCls ? conflictCls : CLASSNAMES

          if (!className && styleName) {
            const { attr, index } = styleName
            const { value } = attr
            const { expression } = value
            if (t.isJSXExpressionContainer(value) && t.isObjectExpression(expression)) {
              const calleeIdent = insertClassnamesSepc(program, name, CLASSNAMES, CLASSNAMESOURCE, CLASSNAMEIMPORTDEFAULT)
              const callee = t.identifier(calleeIdent)
              value.expression = t.callExpression(callee, [null, expression])
            }

            attr.name = t.jsxIdentifier('className')

            attributes.splice(index, 1, attr)
          }

          if (className && styleName) {
            const { attr: c, index: ci } = className
            const { attr: s, index: si } = styleName

            const { value } = s
            let styArg = null
            if (t.isJSXExpressionContainer(value)) {
              styArg = value.expression
            } else {
              styArg = value
            }

            attributes.splice(si, 1)

            const { value: classNameAV } = c

            if (t.isJSXExpressionContainer(classNameAV)) {
              const { expression } = classNameAV

              if (t.isTemplateLiteral(expression) || t.isMemberExpression(expression)) {
                const calleeIdent = insertClassnamesSepc(program, name, CLASSNAMES, CLASSNAMESOURCE, CLASSNAMEIMPORTDEFAULT)
                const callee = t.identifier(calleeIdent)
                className.expression = t.callExpression(calleeIdent, [null, null, expression, styArg])
              }

              if (t.isCallExpression(expression)) {
                expression.arguments.push(styArg)
              }
            }
          }

          node.openingElement.attributes = attributes

          path.replaceWith(node)
        }
      },

      Program (path, state) {
        const { opts: { classnames }, filename, cwd } = state
        program = path

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
