/**
 * @fileoverview JSX attributes helper
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2019-01-04 | sizhao     // initial version
 */

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
  }
}
