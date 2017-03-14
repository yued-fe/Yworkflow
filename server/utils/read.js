'use strict'

const fs = require('fs');

const chalk = require('chalk');
const stripJsonComments = require('strip-json-comments');

module.exports = function (url, callback) {
    console.log(chalk.blue('读取文件:'), chalk.green(url)); // eslint-disable-line no-console
    fs.readFile(url, function (err, result) {
        if (err) {
            console.log(chalk.red('读取文件失败:'), err); // eslint-disable-line no-console
            callback(err);
            return;
        }

        var data;

        try {
            data = JSON.parse(stripJsonComments(result)); // 去掉json中的注释
        } catch (ex) {
            data = result;
        }
        callback(null, data);
    });
};
