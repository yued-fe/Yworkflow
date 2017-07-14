'use strict';

/**
 * utils
 * @namespace utils
 */

const request = require('co-request');
const url = require('url');

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

        // 转发请求
        let reqConf = {
            uri: '',
            method: ctx.method,
            headers: ctx.header,
            body: ctx.request.body,
            gzip: true,
            timeout: 5000,
            followRedirect: false
        };
        
        if (typeof target === 'string') {
            reqConf.uri = target + this.getRealUrl(ctx.url);
        } else {
            reqConf = Object.assign(reqConf, target);
        }

        if (ctx.method.toUpperCase() === 'POST' && ctx.header['content-type'].indexOf('json') > -1) {
            reqConf.body = JSON.stringify(ctx.request.body);
        } else {
            reqConf.form = ctx.request.body;
        }

        // 发送请求
        let result = yield request(reqConf);

        ctx.status = result.statusCode;
        ctx.set(result.headers);
        ctx.body = result.body;

        return result;
    }
};