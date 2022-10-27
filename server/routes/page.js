'use strict'

require('../lib/ejs-inline-template.js')(); //拓展ejs 支持script拓展
const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const utils = require('../utils');

const router = express.Router();
const parse = require('url-parse'); // 获得URL处理模块

// 获得路由表
const routersHandler = require('../lib/routersHandler');

// 首先读取动态路由
const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))

// 读取静态化路由:本地均当成动态路由来进行模拟
const static_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.static_routemap_file))

const routes = routersHandler.parseRouterMap(dynamic_routes);
const confHandler = require('../lib/confHandler');

Object.keys(routes).forEach(function(routePath) {
	const domainToRoute = routes[routePath]; // 数据格式: { host1: route1, host2: route2 }
	// express 路由开始
	router.get(routePath, function(req, res, next) {
		let method = req.method.toLowerCase(); // 请求方法
		// const reqQueryString = parse(req.url).query;
		// console.log(parse(req.url).query)

		let searchQuery = utils.getProxyQuery(req.query, req.params);
		// 如果req.originalUrl获得URL为完整域名,则直接返回
		// 否则则进行补全
		let resFullUrl = '';

		if (parse(req.originalUrl).hostname) {
			resFullUrl = req.originalUrl;
		} else {
			resFullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		}
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
			const fileUrlJson = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, route.cgi.replace(/(\?|&)[a-zA-Z0-9]+=/g, '-')) + '.json';
			const fileUrlJs = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json, route.cgi.replace(/(\?|&)[a-zA-Z0-9]+=/g, '-')) + '.js';

			// 如果有js, 优先读js
			if(fs.existsSync(fileUrlJs)) {
				console.log(chalk.blue('[读取js文件] ' + fileUrlJs));
				fs.readFile(fileUrlJs, { encoding: 'utf-8' }, function (err, data) {
					if (err) {
						proxyToRemote();
					} else {
						var nextCallback = function (err, rs) {
							if (err) {
								res.sendStatus(err.code);
							} else {
								render(rs);
							}
						};
						var fun = new Function('req', 'res', 'next', data);
						fun(req, res, nextCallback);
					}
				});
			} else {

				utils.read(fileUrlJson, function(err, data) {
					if (err) {
						proxyToRemote();
					} else {
						render(data)
					}
				});
			}
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

			console.log(chalk.blue('[读取模板] ') + path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views, `${route.views}.html`));

			res.render(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views, `${route.views}.html`), result)
		}

		function proxyToRemote() {
			let url;
			if (route.schema) {
				// 如果是 GQL 接口，直接使用 cgi
				url = PROJECT_CONFIG.proxy_server + route.cgi;
				method = 'post';
				req.headers['content-type'] = 'application/json'

				// 拼接 直出 schema 文件路径
				const schemaQuery = utils.getSSRSchema(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, '/schema'), route.schema, route.args);

				// 合并variables，权重: 请求 query < params < variables 配置
				const variables = Object.assign({}, req.query, req.params, route.variables);

				req.body = {
					query: schemaQuery,
					variables
				}
			} else {
				// 拼接远程请求路径
				url = utils.appendQueryString(PROJECT_CONFIG.proxy_server + route.cgi, searchQuery);
			}

			// 请求调试服务器
			utils.request(method, url, req.body, req.headers, function(err, data) {
				// 如果出错,则抛出错误
				if (err) {
					res.send(err.stack)
				} else {
					let finalData = data
					// 如果业务侧有配置处理请求结果的函数，则调用
					if (route.schema && route.handlerWithData) {
						try {
							route.handlerWithData({state: {schema: route.schema}}, finalData.data || {})
						} catch (error) {
							console.log("处理请求结果错误：", error)
						}
					}
					render(finalData)
				}
			})
		}
	})

});

module.exports = router;
