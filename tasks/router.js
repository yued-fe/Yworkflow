/**
 * 合并多个路由文件到单一路由文件
 * 防止线上服务器路由文件冗余导致的潜在风险,将配置路由文件夹中的路由配置转成单一路由
 * @type {[type]}
 */

'use strict'

const _ = require('lodash');
const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const fs = require('fs');
const parse = require('url-parse'); // 获得URL处理模块

const routes = {};
const domainList = [];
// 首先读取动态路由
const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))
var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

console.log('分析路由')