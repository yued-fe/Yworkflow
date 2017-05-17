'use strict'

const _ = require('lodash');
const fs = require('fs');
const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const chalk = require('chalk');
const dateFormat = require('dateformat');
const stripJsonComments = require('strip-json-comments'); // 注释json相关
const staticConf = require('../lib/confHandler').getStaticConf(); // 获得模板层变量


/**
 * 在data中注入公用json
 * @param  {[type]} result [description]
 * @return {[type]}        [description]
 */
module.exports = function(result, req, res) {
	let publish_json = {
        "envType":PROJECT_CONFIG.env,
        "CLIENT_URL":req.protocol + '://' + req.get('host') + req.originalUrl,
        "CLIENT_UA":req.headers['user-agent'],
        "pageUpdateTime":dateFormat((new Date()).getTime(),"yyyy-mm-dd,HH:MM:ss"),
        "staticConf":staticConf, // 模板配置变量
	};

	// 增加YUE通用变量兼容
	publish_json.YUE = Object.assign({},publish_json);

    // 如果没有配置,则直接返回原始数据
    if (!fs.existsSync(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json))) {
        return _.merge(publish_json, result)
    }

	//检查公共数据是否存在loader加载器
	if (fs.existsSync(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json, 'index.js'))) {
		publish_json = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json));
		result = _.merge(result, publish_json)
	} else {
		// 如果没有加载文件,则遍历文件夹json
		let public_json_folder_path = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json);

		// 首先遍历所有的json,合并公用数据
		fs.readdirSync(public_json_folder_path).filter(function(file) {
			return path.extname(file) === '.json' && file !== 'index.js';
		}).forEach(function(file) {
			try {
				var json = JSON.parse(stripJsonComments(fs.readFileSync(path.join(public_json_folder_path, file),'utf8')))
			} catch (e) {
				console.log(e);
				console.log(chalk.red('[错误]公共JSON数据异常' + path.join(public_json_folder_path, file) + ',请检查数据'));
			}
			publish_json = _.merge(publish_json, json)
		});

		// 允许开发者做轻量开发,动态处理数据
		// 开发者可以在公共json数据以模块形式,进行数据处理
		// 返回的修改后的result数据
		fs.readdirSync(public_json_folder_path).filter(function(file) {
			return path.extname(file) === '.js' && file !== 'index.js';
		}).forEach(function(file) {
			try {
				let modifyResultHandler = require(path.join(public_json_folder_path, file))
				result = _.merge(modifyResultHandler(result, req, res), result)
			} catch (e) {
				console.log(chalk.red('[错误]公共JSON模块异常' + path.join(public_json_folder_path, file) + ',请检查数据'));
			}

		});

		// 若CGI请求中参数存在,则以实际接口请求中的为准
		result = _.merge(publish_json, result)
	}

	return result;

};
