'use strict';

/**
 * utils
 * @namespace utils
 */

const request = require('co-request');
const url = require('url');
const chalk = require('chalk');

module.exports = {

    getRealUrl(oriUrl) {
        return url.parse(oriUrl).path;
    },
    /**
     * 转发请求
     * @param  {string|object}  target      要转发的host或{uri: ''}
     * @param  {object}         ctx         this
     * @return {object}         result      返回结果
     */
    proxyReq: function* (target, ctx) {

        let uri;
        if (typeof target === 'string') {
            uri = target + this.getRealUrl(ctx.url);
        } else {
            uri = target.uri;
        }

        // 转发请求
        let reqConf = {
            uri: uri,
            method: ctx.method,
            headers: Object.assign(ctx.header, {
                host: url.parse(uri).host
            }),
            body: ctx.request.body,
            // gzip: true,
            timeout: 5000,
            encoding: null,
            followRedirect: false
        };
        

        if (ctx.method.toUpperCase() === 'POST' && ctx.header['content-type'].indexOf('json') > -1) {
            reqConf.body = JSON.stringify(ctx.request.body);
        } else {
            reqConf.form = ctx.request.body;
        }

        // 发送请求
        let result = yield request(reqConf);

        ctx.appendLog('[proxyReq] 请求线上：' + chalk.magenta(uri));

        ctx.status = result.statusCode;
        ctx.set(result.headers);
        ctx.body = result.body;
        return result;
    }
};