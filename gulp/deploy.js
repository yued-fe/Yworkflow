/**
 * 发布部署
 */
var PROJECT_CONFIG = require('../.yconfig'); //载入项目基础配置
var gulp = require('gulp');

var dateFormat = require('dateformat'); //获得自然时间


/**
 * 压缩最终的文件
 * 自动增加当前时间戳 + 项目名称
 * $ gulp zip
 */

