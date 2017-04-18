
'use strict';
const _ = require('lodash');

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const parse = require('url-parse'); // 获得URL处理模块

const routes = {};
// 首先读取动态路由
const server_conf = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.server_conf_file));


const NODE_ENV = PROJECT_CONFIG.env || process.env.NODE_ENV;

const extends_loader = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.extends_loader_file));

/**
 * 获得staticConf变量
 * @param  {[type]} routerMap [description]
 * @return {[type]}           [description]
 */
exports.getStaticConf = function() {

    return server_conf.genConf[NODE_ENV].static;
}


/**
 * 活动中间组件
 * @return {[type]} [description]
 */
exports.getExtendsLoader = function() {
    return extends_loader;
}
