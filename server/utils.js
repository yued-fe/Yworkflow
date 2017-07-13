'use strict';

/**
 * utils
 * @namespace utils
 */

const request = require('co-request');

module.exports = {
    /**
     * 转发请求
     * @param  {string} host     要转发的host
     * @param  {object} ctx      this
     * @return {object} result   返回结果
     */
    proxyReq: function* (host, ctx) {
        // 转发请求
        let reqConf = {
            uri: host + ctx.url,
            method: ctx.method,
            headers: ctx.header,
            body: ctx.request.body,
            gzip: true,
            timeout: 5000,
            followRedirect: false
        };

        if (ctx.method.toUpperCase() === 'POST' && ctx.header['content-type'].indexOf('json') > -1) {
            reqConf.body = JSON.stringify(ctx.request.body);
        } else {
            reqConf.form = ctx.request.body;
        }

        // 发送请求
        const result = yield request(reqConf);

        ctx.status = result.statusCode;
        ctx.set(result.headers);
        ctx.body = result.body;

        return result;
    }
};