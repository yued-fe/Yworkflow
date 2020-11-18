'use strict'

const path = require('path');

/**
   * 拼接 直出 schema
   * @param   rootPath           服务器上 schema 文件的根目录
   * @param   schemaArr          配置文件以数组形式给出需要的 schema 文件地址
   * @param   args               配置文件以字符串形式给出需要的动态参数模板
   */
module.exports = function getSSRSchema(rootPath, schemaArr, args) {
  const strArr = schemaArr.map(item => {
    // 拼接 直出 schema 文件路径
    const schemaPath = path.join(rootPath, item);
    const schemaQuery = require(schemaPath);
    return schemaQuery || '';
  })
  return `
      query ${args ? args : ''} {
        ${strArr.join('')}
      }
    `
}
