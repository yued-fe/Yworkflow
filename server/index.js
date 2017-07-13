'use strict';

/**
 * Yworkflow 本地转发
 * @module server/index
 * 
 * @param {object}      opt                     启动参数对象
 * @param {object}      opt.mockConf            mockServer 配置
 * @param {object}      opt.staticConf          staticServer 配置
 * @param {object}      opt.yuenodeConf         yuenode 配置
 * @param {string}      opt.port                启动端口
 * @param {string}      opt.masterhost          masterhost
 * @param {object}      opt.alias               alias
 * @param {array}       opt.hosts               需要走yworkflow的域名
 * @param {array}       opt.ajax                ajax接口数组
 * @param {object}      opt.staticMap           静态资源map
 */
global.Promise = require('bluebird');
const chalk = require('chalk');
const app = require('koa')();
const router = require('koa-router')();

const utils = require('../utils.js');

module.exports = function Yworkflow(opt = {}) {

    app.use(function* (next) {
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            console.log(chalk.red(`[Yworkflow] ${this.url} ${err.message}`));
        }
    });

    // 处理host
    app.use(function* (next) {
        // 处理 ip 和 localhost 访问
        const ipReg = /\d+\.\d+\.\d+\.\d(:\d+)?/i;
        const localReg = /localhost(:\d+)?/i;
        if (ipReg.test(this.host) || localReg.test(this.host)) {
            this.host = opt.masterhost;
        }
        // 去除 local 和 端口
        this.host = this.host.replace(/^local/i, '').replace(/:\d*$/, '');
        // alias
        if (opt.alias[this.host]) {
            this.host = opt.alias[this.host];
        }

        yield next;
    });

    // 判断代理域名，不符合转发出去
    app.use(function* (next) {
        if (opt.hosts.includes(this.host)) {
            yield next;
        } else {
            // 转发请求
            const result = yield utils.proxyReq(this.protocol + '://' + this.host, this);
        }
    });

    // mock转发
    opt.ajax.push('/page', '/mpage');
    for (let route of opt.ajax) {
        router.all(route, function* () {
            const result = yield utils.proxyReq(this.protocol + '://' + this.host + ':' + opt.mockConf.port, this);
        });
    }

    // 静态转发
    let localStaticMap = {};
    for (let route of Object.keys(opt.staticMap)) {
        // 有http的去线上
        if (opt.staticMap[route].startsWith('http')) {
            router.all(route, function* () {
                const result = yield utils.proxyReq(opt.staticMap[route].replace(new RegExp(route + '$', 'i'), ''), this);
            });
        // 本地
        } else {
            router.all(route, function* () {
                const result = yield utils.proxyReq(this.protocol + '://' + this.host + ':' + opt.staticConf.port, this);
            });
        }
    }

    app.use(router.routes()).use(router.allowedMethods());

    // 启动监听
    app.listen(opt.port, () => {
        console.log(chalk.green('Yworkflow is listening on port: '), chalk.bold(opt.port));
    });
};