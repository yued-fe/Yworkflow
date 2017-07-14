'use strict';

/**
 * 本地转发 server
 * @module server/serverProxy
 * 
 * @param {object}      opt                     启动参数对象
 * @param {number}      opt.port                启动端口
 * @param {string}      opt.masterhost          masterhost
 * @param {object}      opt.alias               alias
 * @param {array}       opt.hosts               需要走yworkflow的域名
 * @param {array}       opt.ajax                ajax接口数组
 * @param {object}      opt.staticMap           静态资源map
 * @param {string}      opt.ejsRewriteRouter    针对旧有的 /ejs 反向代理做特殊处理指向 /qd
 * @param {object}      opt.mockConf            mockServer 配置
 * @param {object}      opt.staticConf          staticServer 配置
 * @param {object}      opt.yuenodeConf         yuenode 配置
 */
global.Promise = require('bluebird');
const chalk = require('chalk');
const app = require('koa')();
const router = require('koa-router')();

const utils = require('./utils.js');
const mockServer = require('./mockServer/index.js');
const staticServer = require('./staticServer/index.js');
const yuenodeServer = require('./yuenode/index.js');

module.exports = function Yworkflow(opt = {}) {

    app.use(function* (next) {
        try {
            console.log(chalk.bgCyan(`[Yworkflow] ${this.url}`));
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            console.log(chalk.red(`[Yworkflow] ${this.url} ${err.message}`));
            console.log(err.stack)
        }
    });

    // 处理host
    app.use(function* (next) {
        // 处理 ip 和 localhost 访问
        const ipReg = /\d+\.\d+\.\d+\.\d(:\d+)?/i;
        const localReg = /localhost(:\d+)?/i;
        if (ipReg.test(this.host) || localReg.test(this.host)) {
            this.request.header.host = opt.masterhost;
        }
        // 去除 local 和 端口
        this.request.header.host = this.host.replace(/^local/i, '').replace(/:\d*$/, '');

        yield next;
    });

    // 判断代理域名，不符合转发出去
    app.use(function* (next) {
        if (opt.hosts.includes(this.host)) {
            yield next;
        } else {
            // 转发请求
            const result = yield utils.proxyReq({
                uri: this.protocol + '://' + this.host.replace(/^http(s)?:\/\//i,'') + utils.getRealUrl(this.url)
            }, this);
        }
    });

    // alias
    app.use(function* (next) {
        // alias
        if (opt.alias[this.host]) {
            this.request.header.host = opt.alias[this.host];
        }

        yield next;
    });

    // cors
    app.use(function* (next) {
        yield next;

        if (!this.header['Access-Control-Allow-Origin']) {
            this.set('Access-Control-Allow-Origin', '*');
        }
        if (!this.header['Access-Control-Allow-Headers']) {
            this.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
        }
    });

    // mock转发
    for (let route of opt.ajax) {
        router.all(route + '/*', function* () {
            const result = yield utils.proxyReq(this.protocol + '://127.0.0.1:' + opt.mockConf.port, this);
        });
    }

    // 静态转发
    // 针对旧有的 /ejs 反向代理做特殊处理指向 /qd
    router.get(opt.ejsRewriteRouter + '/*', function* () {
        const result = yield utils.proxyReq({
            uri: this.protocol + '://127.0.0.1:' + opt.staticConf.port + utils.getRealUrl(this.url).replace(new RegExp('^' + opt.ejsRewriteRouter, 'i'), '')
        }, this);
    });
    if (typeof opt.staticMap === 'string') {
        router.get(opt.staticMap + '/*', function* () {
            const result = yield utils.proxyReq(this.protocol + '://127.0.0.1:' + opt.staticConf.port, this);
        });
    } else {
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
                    const result = yield utils.proxyReq(this.protocol + '://127.0.0.1:' + opt.staticConf.port, this);
                });
            }
        }
    }

    // 框架机转发
    router.get('*', function* () {
        const result = yield utils.proxyReq(this.protocol + '://127.0.0.1:' + opt.yuenodeConf.port, this);
    });

    app.use(router.routes()).use(router.allowedMethods());

    // 启动mockserver
    mockServer(opt.mockConf);
    // 启动静态server
    staticServer(opt.staticConf);
    // 启动yuenode
    yuenodeServer(opt.yuenodeConf);

    // 启动监听
    app.listen(opt.port, () => {
        console.log(chalk.green('Yworkflow is listening on port: '), chalk.bold(opt.port));
    });
};