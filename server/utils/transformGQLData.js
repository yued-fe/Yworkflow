'use strict'

module.exports = function (body) {
  if (body.data && body.data.user && body.data.wallet) {
    // 将 wallet 对象树中的 叶子  属性映射到 user 中
    Object.keys(body.data.wallet).forEach(walletKey => {
      if (body.data.wallet[walletKey]) {
        Object.keys(body.data.wallet[walletKey]).forEach(itemKey => {
          body.data.user[itemKey] = body.data.wallet[walletKey][itemKey]
        })
      }
    })
  }
  return body;
}
