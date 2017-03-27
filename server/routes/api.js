'use strict'

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const express = require('express');
const utils = require('../utils');
const qs = require('qs');
const parse = require('url-parse');
const router = express.Router();

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
    if (PROJECT_CONFIG.debug) {
        proxyToRemote();
    } else {
        // 拼接本地文件路径
        const fileUrl = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, reqPath) + '.json';
        utils.read(fileUrl, function(err, result) {
            if (err) {
                proxyToRemote();
            } else {
                send(result);
            }
        });
    }
}


const ajaxPath = PROJECT_CONFIG.ajax;
ajaxPath.forEach(function(link) {
    router.all(link + '/*', ajaxHandler);
})

module.exports = router;
