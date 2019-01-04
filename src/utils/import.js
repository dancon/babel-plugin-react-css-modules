/**
 * @fileoverview import utils
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-04 | sizhao       // inital version
 */

const types = require('@babel/types')

const { CLASSNAMES, CLASSNAMESOURCE } = require('./constant')

function hasClassnamesImport (program, importSrc) {
  const impSrc = types.stringLiteral(importSrc || CLASSNAMES)
  const body = program.get('body')

  return body.some(nodePath => {
    return nodePath.isImportDeclaration({
      source: impSrc
    })
  })
}

module.exports = {
  hasClassnamesImport,

  getClassnamesSepc (program) {

  },

  insertClassnamesSepc (program, importSpec, importSrc) {
    if (!program.scope.hasBinding(CLSNAMES)) {
      const classNameDefSpec = t.importDefaultSpecifier(t.identifier(CLSNAMES))
      const classnamesImpo = t.importDeclaration([classNameDefSpec], t.stringLiteral('@pandolajs/classnames'))
      program.unshiftContainer('body', classnamesImpo)
    }
  }
}
