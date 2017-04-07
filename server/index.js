'use strict'

require('./lib/ejs-inline-template.js'); //拓展ejs 支持script拓展
const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
const confHandler = require('./lib/confHandler');
const path = require('path');
const bodyParser = require('body-parser');
const parse = require('url-parse'); // 获得URL处理模块

const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan'); // http请求日志
const proxy = require('express-http-proxy'); // 代理服务
const request = require('request');
const async = require("async");

const app = express();


app.use(morgan('dev')); // 启动开发日志

// 拓展中间件
app.locals = confHandler.getExtendsLoader();

app.set('view engine', 'ejs'); // 载入ejs模板
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || PROJECT_CONFIG.port); // 设置默认端口

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(cookieParser());

// 本地调试允许所有请求
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

const apiRouter = require('./routes/api');
const pageRouter = require('./routes/page');
const magicRouter = require('./routes/magic'); // 一个供静态化使用的便捷路由

// 静态资源代理配置
const staticPath = PROJECT_CONFIG.paths.static;
if (typeof staticPath === 'string') {
    app.use(express.static(staticPath));
} else if (typeof staticPath === 'object') {
    // 将静态目录的配置具体到 '/dist' -> '/path/to/dist', 这样可以快速定位
    Object.keys(staticPath).forEach(function(key) {
        // 如果静态资源中映射有指定线上资源,则直接proxy到线上资源
        let REG_HTTP = new RegExp("^(http|https)://", "i");
        if (REG_HTTP.test(staticPath[key])) {
            app.use(key, proxy(staticPath[key], {
                // 过滤掉有外网资源和请求
                // filter: function(req, res) {
                // 	return req.method == 'GET';
                // },
                forwardPath: function(req) {
                    var parseUrl = parse(req.url);
                    let remoteUrl = '';
                    if (parse(req.url).hostname) {
                        remoteUrl = staticPath[key] + parseUrl.pathname + parseUrl.query + '&proxy=yuenode';
                    } else {
                        remoteUrl = staticPath[key] + req.url;
                    }
                    console.log(chalk.blue('[请求代理]:') + chalk.green(remoteUrl));
                    return staticPath[key] + req.url
                },
                intercept: function(rsp, data, req, res, callback) {
                    callback(null, data);
                }
            }));
        } else {
            app.use(key, express.static(path.join(PROJECT_CONFIG.absPath, staticPath[key])));
        }
    });

}

// 启动API相关路由
// 可以在yconfig中配置所有的 /ajax 相关路由
app.use(apiRouter);

// 启动业务相关路由
app.use(pageRouter);
app.use('/magic',magicRouter);

// 代理其他资源到原始的URL
app.use(function(req, res, next) {
    let rawheaders = req.headers;
    // 继承原始CLIENT HEADER
    let options = {
        url: req.originalUrl,
        headers: req.headers,
        encoding: null
    }
    async.waterfall([
        function(cb) {
            request(options, function(e, response, result) {
                if (e) {
                    console.log(chalk.red('代理出错了'));
                    cb(null, {
                        response: response,
                        result: result
                    });
                    return false;
                }
                var proxyData = {
                    response: response,
                    result: result
                }
                cb(null, proxyData)
            })
        }
    ], function(err, result) {
        if (result.response) {
            res.status(result.response.statusCode);
            res.set(result.response.headers);
            res.send(result.response.body);
            next();
        } else {
            next();
        }
    })
})

console.log(chalk.green('当前项目绝对路径:') + chalk.red(PROJECT_CONFIG.absPath));
app.listen(app.get('port'), () => {
    console.log('本地服务启动,端口:' + app.get('port'));
    // require('./lib/document')('', pageRouter.stack);
    require('./lib/document')('', apiRouter.stack);
})
