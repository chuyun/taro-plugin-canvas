if (process.env.TARO_ENV === 'weapp') {
  module.exports = require('./weapp/index')
  module.exports.default = module.exports
}
