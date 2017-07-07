/**
 * 合并多个路由文件到单一路由文件
 * 防止线上服务器路由文件冗余导致的潜在风险,将配置路由文件夹中的路由配置转成单一路由
 * @type {[type]}
 */

'use strict'
const PROJECT_CONFIG = require('../yworkflow'); //载入项目基础配置
if (!PROJECT_CONFIG.tasks.router) {
	return;
}
const TASK_CONFIG = PROJECT_CONFIG.tasks.router;

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const dateformat = require('dateformat');
const sortJson = require('sort-json');
const ejs = require('ejs');

// 首先读取动态路由
const dynamic_routes_abs = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file);
const dynamic_routes = require(path.join(dynamic_routes_abs))


// 直接合并路由文件到单一的js
function checkRouterFile(routerPath) {
	console.log('[检查路由]' + routerPath);
	var generatedRouters = Object.assign({}, dynamic_routes);
	var commentList='';
	if (!!TASK_CONFIG.exclude && TASK_CONFIG.exclude.length > 0) {
		for (let i = 0; i < TASK_CONFIG.exclude.length; i++) {
			let thisExcludeFile = path.join(PROJECT_CONFIG.absPath, TASK_CONFIG.srcEntry, TASK_CONFIG.exclude[i]);
			Object.keys(require(thisExcludeFile)).forEach(function(obj, index) {
				generatedRouters = _.omit(generatedRouters,obj)
				commentList += '*  ' + obj + '\n'
			})
		}
	}

	const router_tpl = [
		'/**',
		'* 业务代号: ' + PROJECT_CONFIG.name,
		'* 更新时间: ' + dateformat((new Date()).getTime(), 'yyyy-mm-dd HH:MM:ss'),
		'* 本地路由数量: ' + Object.keys(dynamic_routes).length,
		'* 线上路由数量: ' + Object.keys(generatedRouters).length,
		'* ====ROUTERS EXCLUDES======',
		commentList,
		'* ====END=========',
		'*/',
		'module.exports =',
		'<%- routers %>'
	].join('\n')

	// 首先检查路由是文件夹还是单一文件
	let routerString = ejs.render(router_tpl, {
		routers: JSON.stringify(sortJson(generatedRouters), null, 4)
	});
	console.log('[路由合并] 最终路由配置有' +  Object.keys(generatedRouters).length + '条')
	fs.writeFileSync(path.join(PROJECT_CONFIG.absPath, TASK_CONFIG.dest), routerString);
}

gulp.task('router:concat', function(done) {
	console.log('[路由合并]');
	checkRouterFile(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))
});

gulp.task('router', function(done) {
	gulp.watch(path.join(PROJECT_CONFIG.absPath,TASK_CONFIG.srcEntry,'**/*'), ['router:concat']);
	runSequence('router:concat', done);
});

gulp.task('router:build', function(done) {
	runSequence('router:concat', done);
});
