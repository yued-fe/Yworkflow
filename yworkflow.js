'use strict'



const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

//获得Yworkflow项目根路径
const rootPath = path.resolve('.');
const gutil = require('gulp-util');

/**
 * 加载启动Yworkflow本地Server的核心配置
 * 根据配置读取业务代码
 */


let getConfig,configFile,absPath;

let options = require('./ywork.default');

let envPath = gutil.env.path;

if(!fs.existsSync(envPath)) {

	absPath = process.cwd().substring(0,process.cwd().indexOf('node_modules'));
	try {
	    // 读取子站yworkflow配置
	    configFile = require(absPath + 'yconfig.js');
	    options.absPath = absPath;
	    options = _.merge(options,configFile);
	} catch (err) {
	    // 没有读取到默认添加{}
	    console.log(chalk.red('[没有找到配置文件,请检查是否在项目路径]'));
	}

} else {

	let projectConfig = require(path.resolve(envPath));
	options.absPath = path.resolve(envPath).substring(0,path.resolve(envPath).indexOf(path.basename(path.resolve(envPath))));
	options = _.merge(options,projectConfig);
}

getConfig = options;

module.exports = getConfig;
