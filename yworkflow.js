'use strict'



const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

//获得Yworkflow项目根路径
const rootPath = path.resolve('.');

/**
 * 加载启动Yworkflow本地Server的核心配置
 * 根据配置读取业务代码
 */
module.exports.getConfig = function() {

	let options = require('./ywork.default');
	// 首先检查Yworkflow外层文件夹是否存在 .ywork 配置文件
	// 如果存在,则使用外部配置
	let yworkConfigPath = path.resolve('../');
	if (fs.existsSync(path.join(yworkConfigPath, '.yconfig'))) {
		options.absPath = yworkConfigPath;
		let projectConfig = require(path.join(yworkConfigPath, '.yconfig'))
		options = _.merge(options,projectConfig)
	} else {
		console.log(chalk.red('[没有找到配置文件,请检查是否在项目路径]'));
		console.log(chalk.green('文件:' + path.join(yworkConfigPath, '.yconfig') + ' 不存在'));
		return false;
	}
	return options;
}
