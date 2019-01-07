module.exports = {
  plugins: [
    ['./src/index.js', { classnames: {
      name: 'classnames',
      source: '@bbt/bbt-ui/utils',
      default: false
    }, templateLiteralWithExpression: true }]
  ]
}
