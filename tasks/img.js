/**
 * 图像相关任务
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow'); //载入项目基础配置

if (!PROJECT_CONFIG.tasks.img) {
    return;
}

var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.img;
var path = require('path');

var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var changedDeps = require('./plugins/gulp-changed-deps/');

// 将处理文件全部拷贝到输出目录
gulp.task('img:copy', function() {
	return gulp.src(path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'))
		.pipe(plugins.changed(dest))
		.pipe(gulp.dest(dest));
});

// 优化图片压缩质量  @todo
gulp.task('img:optimize', function(done) {

});


gulp.task('img', function(done) {
	// 监听图片文件
	gulp.watch(path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'), ['img:copy']);
	runSequence('img:copy', done);
});


gulp.task('img:build', function(done) {
	runSequence('img:copy', done);
});





