'use strict';

/**
 * 本地 static server
 * @module server/staticServer
 * 
 * @param {object}      opt                     启动参数对象
 * @param {object}      opt.staticMap           静态资源映射
 */

const router = require('koa-router')();
const send = require('koa-send');
const chalk = require('chalk');

const utils = require('../utils.js');

module.exports = function staticServer(opt = {}) {

    // 静态转发
    for (let route of Object.keys(opt.staticMap)) {
        // 有http的去线上
        if (opt.staticMap[route].startsWith('http')) {
            router.get(route + '/*', function* () {
                const result = yield utils.proxyReq({
                    uri: opt.staticMap[route] + utils.getRealUrl(this.url).replace(new RegExp('^' + route, 'i'), '')
                }, this);
            });
        // 本地
        } else {
            router.get(route + '/*', function* () {
                this.appendLog('[Static Server] 读取本地：' + chalk.blue(opt.staticMap[route] + this.path.replace(new RegExp('^' + route, 'i'),'')));
                yield send(this, this.path.replace(new RegExp('^' + route, 'i'),''), { root: opt.staticMap[route]});
            });
        }
    }

    return router;
};