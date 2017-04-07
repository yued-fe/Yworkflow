/**
 * 静态化任务
 * @type {[type]}
 */
'use strict'

const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
const PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
const TASK_CONFIG = PROJECT_CONFIG.tasks.static;
const path = require('path');

const src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
const dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

const gulp = require('gulp');
const chalk = require('chalk');
const request = require('request');


const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');

const changedDeps = require('./plugins/gulp-changed-deps/');

const utils = require('../server/utils');


var htmlRenderTasks = [];

/**
 * 生成需要静态化的页面任务
 * @return {[type]} [description]
 */
var getHtmlRenderTask = function(){

}

// 将处理文件全部拷贝到输出目录
gulp.task('render', function() {

    request('http://127.0.0.1'  +  ':' + PROJECT_CONFIG.port + '/magic/getPublicData',function(err, res, result){

    })
});


