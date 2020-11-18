'use strict'

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const express = require('express');
const utils = require('../utils');
const chalk = require('chalk');
const qs = require('qs');
var fs = require('fs');
const parse = require('url-parse');
const router = express.Router();

// 独立处理 grl 接口地址
const gqlPath = PROJECT_CONFIG.graphql || [];
gqlPath.forEach(function (link) {
    router.all(link, ajaxHandler);
})

/**
 * ajax请求的闭包处理
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function ajaxHandler(req, res, next) {
    const baseUrl = req.baseUrl;
    const reqUrl = baseUrl + req.url;
    const reqPath = baseUrl + req.path;
    const thisUrl = parse(reqUrl);

    function send(result) {
        if (!result || typeof result !== 'object') {
            result = {};
        }
        if (typeof result.code === 'undefined') {
            result = { code: 0, data: result };
        }

        res.send(result);
    }

    function proxyToRemote() {
        const method = req.method.toLowerCase();
        // 拼接远程请求路径，增加调试参数
        const url = PROJECT_CONFIG.proxy_server + thisUrl.pathname + thisUrl.query;
        utils.request(method, url, req.body, req.headers, function(err, result) {
            // GQL 请求需要返回原始请求结果
            if (gqlPath.indexOf(thisUrl.pathname) > -1) {
                res.send(result);
                return;
            }
            if (err) {
                res.status(500);
                send({
                    code: 500,
                    msg: err.stack
                });
                return;
            }
            res.status(this.statusCode); // 设置状态码
            send(result);
        });
    }
    if (PROJECT_CONFIG.proxy_force) {
        proxyToRemote();
    } else {
        // 拼接本地文件路径
        const fileUrlJson = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, reqPath) + '.json';
        const fileUrlJs = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, reqPath) + '.js';
        if(fs.existsSync(fileUrlJs)) {
            console.log(chalk.blue('[读取js文件] ' + fileUrlJs));
            fs.readFile(fileUrlJs, { encoding: 'utf-8' }, function (err, data) {
                if (err) {
                    proxyToRemote();
                } else {
                    var nextCallback = function (err, rs) {
                        if (err) {
                            res.sendStatus(err.code);
                        } else {
                            send(rs);
                        }
                    };
                    var fun = new Function('req', 'res', 'next', data);
                    fun(req, res, nextCallback);
                }
            });
        } else {
            utils.read(fileUrlJson, function(err, result) {
                if (err) {
                    proxyToRemote();
                } else {
                    send(result);
                }
            });
        }
    }
}


const ajaxPath = PROJECT_CONFIG.ajax;
ajaxPath.forEach(function(link) {
    router.all(link + '/*', ajaxHandler);
})

module.exports = router;
