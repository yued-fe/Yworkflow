'use strict'

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const parse = require('url-parse'); // 获得URL处理模块
// 获得路由表
const routersHandler = require('../lib/routersHandler');
const chalk = require('chalk');
const hosts_list = PROJECT_CONFIG.hosts;
const hosts_alias = PROJECT_CONFIG.alias; // 设置域名映射

const getServerIpList = require('./getServerIp')(); // 获得当前机器的域名

/**
 * 处理host_list
 * @param  {[type]} thisHostName [description]
 * @return {[type]}              [description]
 */

function genRawHost(thisHostName) {
	if (thisHostName.startsWith('local')) {
		var rawHost = thisHostName.replace(/^local/, '');
		if (hosts_alias[rawHost] !== undefined) {
			rawHost = hosts_alias[rawHost];
		}
		console.log(chalk.green('[实际HOST]' + rawHost));
		return rawHost;
	} else {
		return PROJECT_CONFIG.master_host;
	}
}

/**
 * 获得原始的域名host
 * 规范开发多host,本地域名前增加local,例localx.domain.com
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
module.exports = function(url) {
	let domain_prefix = PROJECT_CONFIG.env || process.env.NODE_ENV;
	let thisHostName = parse(url).hostname;
	// 首先判断是否是本地配置的host,如果是才进行host处理
	if (hosts_list.indexOf(thisHostName) !== -1 || getServerIpList.indexOf(thisHostName) !== -1) {
		return genRawHost(thisHostName)
	}else{
		return thisHostName;
	}
};
