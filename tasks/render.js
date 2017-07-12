/**
 * 静态化任务
 * @type {[type]}
 */

'use strict'

const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
const PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;

if (!PROJECT_CONFIG.tasks.render) {
	return;
}

const TASK_CONFIG = PROJECT_CONFIG.tasks.render;
const path = require('path');
const fs = require('fs');

const render_routermap_file = path.join(PROJECT_ABS_PATH, TASK_CONFIG.render_routermap_file);
const render_dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

const render_routes = require('../server/lib/routersHandler').getRenderList();
const checkDirectory = require('../server/lib/checkDirectory');
const gulp = require('gulp');
const chalk = require('chalk');
const request = require('request');
const Minimize = require('gulp-minimize');

const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');

const changedDeps = require('./plugins/gulp-changed-deps/');

const utils = require('../server/utils');

var htmlRenderTasks = [];

// 设置本地代理
var requestProy = request.defaults({
	'proxy': 'http://127.0.0.1' + ':' + PROJECT_CONFIG.port
})

// 首先初始化创建文件夹
checkDirectory.init(render_routes, render_dest);

// html文件压缩
gulp.task('render:minimize', function() {
	return gulp.src(render_dest + '/**/*.html')
		.pipe(plugins.plumber())
		.pipe(Minimize())
		.pipe(gulp.dest(render_dest))
});

/**
 * 生成需要静态化的页面任务
 * @return {[type]} [description]
 */
var getHtmlRenderTask = function(router) {
	return function() {
		checkDirectory.checkFolder(router);
		requestProy.get('http://' + router, function(err, res, result) {
			if (err) {
				console.log(chalk.red(['静态化']) + router + '\n' + err);
				return;
			}
			try {
				console.log(router);
				// 如果路由配置的是 / 则默认补全 index 文件名
				let htmlFileName = (router.substr(-1) == '/') ? 'index.html' : '.html';
				console.log(chalk.blue('[生成文件]') + ' ' + path.join(render_dest, router) + htmlFileName)
				fs.writeFileSync(path.join(render_dest, router) + htmlFileName, result, 'utf-8')
			} catch (e) {
				console.log(chalk.red('[静态化]生成文件错误') + e)
			}

		})
	}
}

// 针对不同路由,独立生成不同的task任务,优化静态化性能
Object.keys(render_routes).forEach(function(router) {
	let htmlRenderTaskName = 'html:render(' + router + ')';
	htmlRenderTasks.push({
		src: render_routermap_file,
		name: htmlRenderTaskName
	});
	gulp.task(htmlRenderTaskName, getHtmlRenderTask(router))

})

// 将处理文件全部拷贝到输出目录
gulp.task('render', function(done) {
	var tasks = [];
    htmlRenderTasks.forEach(function (task) {
        PROJECT_CONFIG.debug && gulp.watch(task.src, [task.name]); // 启动RENDER编译监听
        tasks.push(task.name);
    });
    // 如果开启了压缩,则执行压缩task
    if (PROJECT_CONFIG.tasks.render.minimize) {
        tasks.push('render:minimize');
    }
    tasks.push(done);
    runSequence.apply(runSequence, tasks); // 默认执行一次所有任务
});

gulp.task('render:build', function (done) {
    var tasks = [];
    htmlRenderTasks.forEach(function (task) {
        tasks.push(task.name);
    });
    // 如果开启了压缩,则执行压缩task
    if (PROJECT_CONFIG.tasks.render.minimize) {
        tasks.push('render:minimize');
    }
    tasks.push(done);
    runSequence.apply(runSequence, tasks); // 默认执行一次所有任务
});
