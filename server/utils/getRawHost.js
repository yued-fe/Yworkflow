'use strict'

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const parse = require('url-parse'); // 获得URL处理模块
// 获得路由表
const routersHandler = require('../lib/routersHandler');

/**
 * 获得原始的域名host
 * 规范开发多host,本地域名前增加local,例localx.domain.com
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */

module.exports = function(url) {

	let domain_prefix = PROJECT_CONFIG.env || process.env.NODE_ENV;
	let thisHostName = parse(url).hostname;

	// 如果访问的域名与业务路由中任意域名都不匹配,则默认使用配置文件中配置的masterHost
	if (routersHandler.getDomainsList().indexOf(thisHostName) === -1) {
		return PROJECT_CONFIG.master_host;
	}

	//如果hostname带有local,则返回无local原始host
	if (startsWith(thisHostName, 'local')) {
		return thisHostName.replace(/^local/g, '')
	} else {
		return thisHostName;
	}
};