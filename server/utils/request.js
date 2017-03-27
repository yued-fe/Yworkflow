'use strict'

const urlParse = require('url').parse;

const chalk = require('chalk');
const request = require('request');

module.exports = function (method, url, params, headers, callback) {
    headers.host = urlParse(url).host; // 不修改 host 会502

    const options = {
        url: url,
        headers: headers,
        gzip:true
    };

    if (method === 'post' && headers['content-type'] === 'application/json') {
        options.body = JSON.stringify(params);
    } else {
        options.form = params;
    }

    console.log(chalk.blue('发送请求:'), chalk.green(url), chalk.green(JSON.stringify(params))); // eslint-disable-line no-console

    request[method](options, function (err, res, result) {
        if (err) {
            console.log(chalk.red('发送请求失败:'), err); // eslint-disable-line no-console
            callback(err);
            return;
        }
        result = JSON.stringify(JSON.parse(result),null,4);
        try {
            callback.call(res, null, JSON.parse(result));
        } catch (ex) {
            console.log(chalk.red('数据转JSON失败:'), ex); // eslint-disable-line no-console
            callback(ex);
        }
    });
}
