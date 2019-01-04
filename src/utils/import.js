/**
 * @fileoverview import utils
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-04 | sizhao       // inital version
 */

const types = require('@babel/types')

function getClassnamesImport (program, importSrc) {
  const body = program.get('body')

  return body.find(nodePath => {
    if (nodePath.isImportDeclaration()) {
      const { node } = nodePath.get('source')
      return node.value === importSrc
    }

    return false
  })
}

module.exports = {
  getClassnamesImport,
  insertClassnamesSepc (program, importSpec, importSrc, importDefault, conflictName) {
    const classNamesImpoDec = getClassnamesImport(program, importSrc)

    if (classNamesImpoDec) {
      const { specifiers } = classNamesImpoDec.node

      if (specifiers.length === 1) {
        return specifiers[0].local.name
      } else {
        const spec = specifiers.find(item => {
          return item.local.name === importSpec
        })

        return spec ? spec.local.name : importSpec
      }
    }

    const identifier = types.identifier(conflictName ? conflictName : importSpec)
    const importedSpec = types.identifier(importSpec)
    const classNameDefSpec = importDefault ? types.importDefaultSpecifier(identifier) : types.importSpecifier(identifier, importedSpec)
    const classnamesImpo = types.importDeclaration([classNameDefSpec], types.stringLiteral(importSrc))
    program.unshiftContainer('body', classnamesImpo)

    return importSpec
  }
}
