'use strict';

/**
 * 本地 mock server
 * @module mockServer
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
const request = require('co-request');
const chalk = require('chalk');

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
            let reqConf = {
                uri: opt.proxyServer + this.url,
                method: this.method,
                headers: this.header,
                body: this.request.body,
                gzip: true,
                timeout: 5000,
                followRedirect: false
            };

            if (this.method.toUpperCase() === 'POST' && this.header['content-type'] !== 'application/json') {
                reqConf.form = this.request.body;
            }

            // 发送请求
            const result = yield request(reqConf);

            console.log('[Mock Server] 请求线上：' + chalk.blue(opt.proxyServer + this.url));

            if (result.statusCode !== 200) {
                // 如果后端返回301、302，跳转
                if (result.statusCode === 301 || result.statusCode === 302) {
                    this.status = result.statusCode;
                    return this.redirect(result.headers.location);
                }

                let newErr = new Error(result.statusCode);
                newErr.status = result.statusCode;
                throw newErr;
            }

            this.body = result.body;
        }

        yield next;
    });

    // 启动监听
    app.listen(opt.port, () => {
        console.log(chalk.green('Mock Server is listening on port: '), chalk.bold(opt.port));
    });
};