'use strict'

require('../lib/ejs-inline-template.js'); //拓展ejs 支持script拓展
const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const utils = require('../utils');

const router = express.Router();
const parse = require('url-parse'); // 获得URL处理模块

// 获得路由表
const routersHandler = require('../lib/routersHandler');

// 首先读取动态路由
const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))

// // 读取静态化路由:本地均当成动态路由来进行模拟
const static_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.static_routemap_file))

const routes = routersHandler.parseRouterMap(dynamic_routes);
const confHandler = require('../lib/confHandler');

// const staticViews = Object.keys(static_routes).map(function(routeKey) {
// 	return static_routes[routeKey].views.replace(/^\/|\.html$/g, ''); // 将静态化路由的views转换成和动态化路由的views一致
// });

/**
 * 检查是否以某字符串开头
 * @param  {[type]} str  [description]
 * @param  {[type]} word [description]
 * @return {[type]}      [description]
 */
function startsWith(str, word) {
	return str.lastIndexOf(word, 0) === 0;
}

Object.keys(routes).forEach(function(routePath) {
	const domainToRoute = routes[routePath]; // 数据格式: { host1: route1, host2: route2 }
	// express 路由开始
	router.get(routePath, function(req, res, next) {
		const method = req.method.toLowerCase(); // 请求方法
        const reqQueryString = parse(req.url).query;
		let searchQuery = utils.getProxyQuery(reqQueryString, routePath, req);
		// 如果req.originalUrl获得URL为完整域名,则直接返回
		// 否则则进行补全
		let resFullUrl = '';

		if (parse(req.originalUrl).hostname) {
			resFullUrl = req.originalUrl;
		} else {
			resFullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		}
		console.log('请求' + resFullUrl)
		// 首先确定映射的host主域名
		let route = domainToRoute[utils.getRawHost(resFullUrl)] || domainToRoute[PROJECT_CONFIG.master_host];
		// 如果没有cgi请求,则直接render
		if (!route.cgi) {
			render();
			return;
		}
		// 如果开启强制代理,则所有的数据请求均走http请求
		if (PROJECT_CONFIG.proxy_force) {
			proxyToRemote();
		} else {
			// 拼接本地文件路径, 将 cgi 中的 [?=&] 转换成 -
			const fileUrl = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, route.cgi.replace(/(\?|&)[a-zA-Z0-9]+=/g, '-')) + '.json';
			utils.read(fileUrl, function(err, data) {
				if (err) {
					proxyToRemote();
				} else {
					render(data)
				}
			});

		}

		// 渲染逻辑
		function render(result) {
			if (!result || typeof result !== 'object') {
				result = {};
			}

			result.staticConf = confHandler.getStaticConf();

			result = utils.getPublicJSON(result, req, res);

			// 本地抛出DEBUG_INFO供业务调试
			result.DEBUG_INFO = result;

            console.log(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views, `${route.views}.html`));
			res.render(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views, `${route.views}.html`), result)
		}

		function proxyToRemote() {
			// 拼接远程请求路径
			const url = utils.appendQueryString(PROJECT_CONFIG.proxy_server + route.cgi, searchQuery);
			// 请求调试服务器
			utils.request(method, url, req.body, req.headers, function(err, data) {
				// 如果出错,则抛出错误
				if (err) {
					res.send(err.stack)
				} else {
					render(data);
				}
			})
		}
	})

});

module.exports = router;
