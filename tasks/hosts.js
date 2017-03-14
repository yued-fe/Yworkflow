/**
 * 处理hosts相关
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.static;
var path = require('path');
var gulp = require('gulp');
var fs = require('fs');
var chalk = require('chalk');
var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var hosts = (PROJECT_CONFIG.hosts && PROJECT_CONFIG.hosts.length > 0) ? PROJECT_CONFIG.hosts : PROJECT_CONFIG.env + PROJECT_CONFIG.master_host



gulp.task('hosts', function(done) {
	// 修正hosts文件
	var commentesIntro = '# ' + PROJECT_CONFIG.name + ' Author:' + PROJECT_CONFIG.author + '\n';
	var hostLine = '';

	//首先检查文件中是否已经配置了相关域名hosts
	fs.readFile('/etc/hosts', 'utf-8', function(err, result) {
		if (err) {
			console.log(chalk.red('读取文件失败:'), err); // eslint-disable-line no-console
			callback(err);
			return;
		}
		var hostsLine = result.split('\n');
		Object.keys(hosts).forEach(function(i) {
			hostLine += 'localhost ' + hosts[i] + '\n'
		})

	});


});