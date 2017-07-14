'use strict';

/**
 * 本地 static server
 * @module server/staticServer
 * 
 * @param {object}      opt                     启动参数对象
 * @param {number}      opt.port                启动端口
 * @param {object}      opt.staticMap           静态资源映射
 */

global.Promise = require('bluebird');
const chalk = require('chalk');
const app = require('koa')();
const router = require('koa-router')();
const serve = require('koa-static');

module.exports = function staticServer(opt = {}) {

    app.use(function* (next) {
        try {
            yield next;
            console.log(chalk.blue(`[Static Server] ${this.url} ${this.status}`));
        } catch (err) {
            console.log(chalk.red(`[Static Server] ${this.url} ${err.message}`));
        }
    });

    if (typeof opt.staticMap === 'string') {
        app.use(serve(opt.staticMap, {
                gzip: false
            }));
    } else {
        for (let route of Object.keys(opt.staticMap)) {
            router.get(route + '/*', function* (next){
                // '/qd': '.cache/qd' 访问的时候应该吧路径中的 /qd 去掉以防访问 /qd/qd
                this.request.path = this.request.path.replace(new RegExp('^' + route, 'i'),'');
                yield next;
            }, serve(opt.staticMap[route], {
                gzip: false
            }));
        }
        app.use(router.routes()).use(router.allowedMethods());
    }

    // 启动监听
    app.listen(opt.port, () => {
        console.log(chalk.green('Static Server is listening on port: '), chalk.bold(opt.port));
    });
};