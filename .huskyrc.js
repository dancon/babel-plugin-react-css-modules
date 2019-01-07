/**
 * @fileoverview husky
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-11-16 | sizhao     // initial version
 *
 * @description
 *
 * For more details, please read below references:
 *
 * https://github.com/typicode/husky/blob/master/DOCS.md
 *
 * https://git-scm.com/docs/githooks
*/

module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'lint-staged'
  }
}
