/**
 * 检查静态化的文件夹路径是否存在
 * Author:luolei
 */

'use strict';

const fs = require('fs');
const chalk = require('chalk');
const _ = require('lodash');
const path = require('path');

// 检查文件夹是否存在,若不存在则创建
function checkDirectory(dirPath) {
    try {
        fs.statSync(dirPath);
    } catch (err) {
        fs.mkdirSync(dirPath);
        console.log(chalk.cyan('目录不存在，创建目录:'), dirPath);
        try {
            fs.statSync(dirPath);
        } catch (err) {
            console.log(chalk.red('创建目录 %s 失败！请检查写入权限。'), dirPath);
            throw new Error(`创建目录失败`);
        }
    }
}

module.exports = {
	rootPath:'',// 存放静态化文件的根路径
	/**
	 * 初始化静态化路径检查
	 * @return {[type]} [description]
	 */
	init: function(routerMap,rootPath) {
		// 首先检查设置生成静态化html的文件夹根路径
		this.checkRootPath(rootPath);
		// 接下来一次检查对应路由层级文件夹路径
		this.checkLength(routerMap);
	},

	checkRootPath:function(rootPath){
		console.log(chalk.bgBlue('[静态化]文件存放路径' + rootPath));
		checkDirectory(rootPath);
		this.rootPath = rootPath;
	},

	/**
	 * 检查需要生成的目录个数
	 * @return {[type]} [description]
	 */
	checkLength: function(routerMap) {
		var that = this;
		var folderCheckLength = Object.keys(routerMap).length;
		console.log(chalk.red('[检查]' ) + ' ' + chalk.red(folderCheckLength) + '个路由规则对应的静态化目录是否存在');
		Object.keys(routerMap).forEach(function(router){
			console.log('[静态化路由] ' + router)
			that.checkFolder(router)
		})
	},

	/**
	 * 遍历生成所需要的文件夹
	 * @param  {[type]} path [description]
	 * @return {[type]}      [description]
	 */
	checkFolder: function(router) {
		var that = this;
		var staticPathVal = router;
		var splitStaticPath = staticPathVal.split('/');

		var splitStaticPathExtract = _.filter(splitStaticPath, function(n) {
			return n !== '';
		})
		splitStaticPathExtract = _.dropRight(splitStaticPathExtract);

		//获得最终生成的文件名,强制要求均以index.html或者fileName.index结尾
		var staticFileName = _.takeRight(splitStaticPath);
		var	staticFileNameRaw = staticFileName[0].split('.html')[0];
		var staticFilePathRaw = splitStaticPathExtract.join('/');

		var checkPath = '';
		// 创建根路径

		for (var i = 0; i < splitStaticPathExtract.length; i++) {
			checkPath += '/' + splitStaticPathExtract[i];
			checkDirectory(that.rootPath + checkPath);
		}

	}
}