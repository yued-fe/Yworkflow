/**
 * 处理hosts相关
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow'); //载入项目基础配置
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var chalk = require('chalk');

var hosts = (PROJECT_CONFIG.hosts && PROJECT_CONFIG.hosts.length > 0) ? PROJECT_CONFIG.hosts : PROJECT_CONFIG.env + PROJECT_CONFIG.master_host

// 自动读取配置中的hosts配置,写入本地/etc/hosts文件
gulp.task('hosts', function(done) {
	// 修正hosts文件
	var commentesIntro = '# ' + PROJECT_CONFIG.name + ' Author:' + PROJECT_CONFIG.author + '\n';
	var hostLine = '';
	//首先检查文件中是否已经配置了相关域名hosts
	fs.readFile('/etc/hosts', 'utf-8', function(err, result) {
		if (err) {
			console.log(chalk.red('[HOST]读取hosts信息失败:'), err); // eslint-disable-line no-console
			callback(err);
			return;
		}
		var hostsLine = result.split('\n');
		Object.keys(hosts).forEach(function(i) {
			hostLine += 'localhost ' + hosts[i] + '\n'
		})
		fs.appendFile('/etc/hosts', hostLine, function(err) {
			if(err){
				console.log(chalk.red('[HOST]修改hosts失败\n'), err);
			}
		});

	});


});
