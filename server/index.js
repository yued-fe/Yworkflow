'use strict'

require('./lib/ejs-inline-template.js'); //拓展ejs 支持script拓展
const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
const confHandler = require('./lib/confHandler');
const path = require('path');
const bodyParser = require('body-parser');


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

const apiRouter = require('./routes/api');
const pageRouter = require('./routes/page');

// 静态资源代理配置
const staticPath = PROJECT_CONFIG.paths.static;
if (typeof staticPath === 'string') {
	app.use(express.static(staticPath));
} else if (typeof staticPath === 'object') {
	// 将静态目录的配置具体到 '/dist' -> '/path/to/dist', 这样可以快速定位
	Object.keys(staticPath).forEach(function(key) {
		// 如果静态资源中映射有指定线上资源,则直接proxy到线上资源
		let REG_HTTP = /^(hstaticPathttp|https):/
		if (REG_HTTP.test([key])) {
			app.use(key, proxy(staticPath[key], {
				// 过滤掉有外网资源和请求
				filter:function(req,res){
					console.log('过滤资源');
					console.log(req.method);
					return req.method == 'GET';
				},
				forwardPath: function(req) {
					console.log('走指定资源代理');
					console.log(key);
					console.log(chalk.green(staticPath[key] + req.url));
					return staticPath[key] + req.url
				}
			}));
		} else {
			app.use(key, express.static(path.join(PROJECT_CONFIG.absPath, staticPath[key])));
		}
	});
}

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

// 启动API相关路由
// 可以在yconfig中配置所有的 /ajax 相关路由
app.use(apiRouter);

// 启动业务相关路由
app.use(pageRouter);

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
					cb(null, {
						response: response,
						result: result
					});
				}
				var proxyData = {
					response: response,
					result: result
				}
				console.log(chalk.green('PROXY:' + response.statusCode));
				cb(null, proxyData)
			})
		}
	], function(err, result) {
		res.status(result.response.statusCode);
		res.set(result.response.headers)
		if (err) {
			res.send(err);
			console.log(chalk.red('出错了'));
			return false;
		}
		res.send(result.response.body);
	})
})


console.log(chalk.green('当前项目绝对路径:') + chalk.red(PROJECT_CONFIG.absPath));

// 拓展 extends 功能
// app.locals = require('./config/extends/loader');
app.listen(app.get('port'), () => {
	console.log('本地服务启动,端口:' + app.get('port'));
})