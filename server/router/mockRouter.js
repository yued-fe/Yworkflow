'use strict';

/**
 * 本地 mock server
 * @module server/mockServer
 * 
 * @param {object}      opt                     启动参数对象
 * @param {array}       opt.ajax                ajax接口数组
 * @param {string}      opt.jsonPath            本地json文件路径
 * @param {string}      opt.publicJsonPath      本地公共json文件路径
 * @param {boolean}     opt.proxyForce          是否强制代理到线上
 * @param {string}      opt.proxyServer         线上接口服务地址
 */

const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const chalk = require('chalk');
const stripJsonComments = require('strip-json-comments');

const utils = require('../utils.js');

module.exports = function mockServer(opt = {}) {

    let publicData = {};
    try {
        const publicJson = fs.readdirSync(opt.publicJsonPath);
        publicJson.forEach((file) => {
            if (file.endsWith('.json')) {
                publicData = Object.assign(publicData, JSON.parse(stripJsonComments(fs.readFileSync(path.join(opt.publicJsonPath,file), 'utf8'))));
            } else {
                publicData = Object.assign(publicData, require(path.join(opt.publicJsonPath,file)));
            }
        });
    } catch (err) {
        console.log(err.message);
    }

    for (let route of opt.ajax) {
        router.all(route + '/*', function* () {
            try {
                // 开启强制代理则发送请求
                if (opt.proxyForce) {

                    throw new Error('开启强制代理到 ' + opt.proxyServer);

                // 没有开启强制代理则访问本地json，本地没json也尝试向线上请求
                } else {
                    let jsonPath = path.join(opt.jsonPath, this.path);
                    jsonPath = jsonPath.endsWith('.json') ? jsonPath : jsonPath + '.json';
                    const json = stripJsonComments(fs.readFileSync(jsonPath, 'utf8'));

                    this.appendLog('[Mock Server] 读取json：' + chalk.blue(jsonPath));

                    this.body = JSON.stringify(Object.assign(publicData, JSON.parse(json)));
                }
            } catch (err) {

                this.appendLog(chalk.red('[Mock Server] ' + err.message));

                // 转发请求
                const result = yield utils.proxyReq(opt.proxyServer, this);
            }
        });
    }

    return router;
};