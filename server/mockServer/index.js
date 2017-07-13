'use strict';

/**
 * 本地 mock server
 * @module server/mockServer
 * 
 * @param {object}      opt                     启动参数对象
 * @param {string}      opt.port                启动端口
 * @param {string}      opt.jsonPath            本地json文件路径
 * @param {boolean}     opt.proxyForce          是否强制代理到线上
 * @param {string}      opt.proxyServer         线上接口服务地址
 */

global.Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const app = require('koa')();
const chalk = require('chalk');

const utils = require('../utils.js');

module.exports = function mockServer(opt = {}) {

    app.use(function* (next) {
        try {
            this.status = 200;
            yield next;
            console.log(chalk.blue(`[Mock Server] ${this.url} success`));
        } catch (err) {
            this.status = err.status || 500;
            console.log(chalk.red(`[Mock Server] ${this.url} ${err.message}`));
        }
    });

    app.use(function* (next) {
        try {
            // 开启强制代理则发送请求
            if (opt.proxyForce) {

                throw new Error('开启强制代理到 ' + opt.proxyServer);

            // 没有开启强制代理则访问本地json，本地没json也尝试向线上请求
            } else {
                const jsonPath = path.join(opt.jsonPath, this.path);
                const json = fs.readFileSync(jsonPath);

                console.log('[Mock Server] 读取json：' + chalk.blue(jsonPath));

                this.body = json;
            }
        } catch (err) {

            console.log(chalk.red('[Mock Server] ' + err.message));

            // 转发请求
            const result = yield utils.proxyReq(opt.proxyServer, this);

            console.log('[Mock Server] 请求线上：' + chalk.blue(opt.proxyServer + this.url));
        }

        yield next;
    });

    // 启动监听
    app.listen(opt.port, () => {
        console.log(chalk.green('Mock Server is listening on port: '), chalk.bold(opt.port));
    });
};