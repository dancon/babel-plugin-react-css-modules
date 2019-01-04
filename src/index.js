/**
 * @fileoverview babel-plugin-react-css-modules
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-03 | sizhao         // initial version
 */
const babelPluginSyntaxJSX = require('@babel/plugin-syntax-jsx')

const { getClassName } = require('./utils/attributes')

module.exports = function (babel) {
  const { types: t } = babel
  let cssModules = t.identifier('_CSSM_')

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

        if (attr) {
          const { index, attr: className } = attr

          if (className && className.value.type === 'StringLiteral') {
            className.value = t.jSXExpressionContainer(t.memberExpression(cssModules, className.value, true))
            attributes.splice(index, 1, className)
            node.openingElement.attributes = attributes
          }
        }

        path.replaceWith(node)
      }
    }
  }
}
