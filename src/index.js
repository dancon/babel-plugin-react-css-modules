/**
 * @fileoverview babel-plugin-react-css-modules
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-03 | sizhao         // initial version
 */

const p = require('path')
const babelPluginSyntaxJSX = require('@babel/plugin-syntax-jsx')

const {
  getClassName,
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
        if (!/^(?:class|style)Name$/.test(name)) {
          return
        }

        if (name === 'styleName') {
          cssModules = t.nullLiteral()
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
          /* className.value = t.jSXExpressionContainer(classNameVal)
          attributes.splice(index, 1, className)
          node.openingElement.attributes = attributes

          path.replaceWith(node) */
          console.log('exit')
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
