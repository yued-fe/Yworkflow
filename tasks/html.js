/**
 * 处理html模板相关
 * @type {[type]}
 */
'use strict'


var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置

if (!PROJECT_CONFIG.tasks.html) {
    return;
}

var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.html;

var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var glob = require('glob');
var htmlbeautify = require('gulp-html-beautify');

var changedDeps = require('./plugins/gulp-changed-deps/');
var path = require('path');
var gulp = require('gulp');
var fs = require('fs');
var chalk = require('chalk');
var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var htmlCompileTasks = [];

// 生成html编译任务

gulp.task('html', function (done) {

    var getHtmlCompileTask = function (inputDir, outputDir) {

        return function () {
            var inputSrc = [path.join(inputDir, '**/*.html')];
            if (!PROJECT_CONFIG.debug) {
                inputSrc.push('!' + path.join(inputDir, '_*/**/*.html')); // 非 debug 模式已出以 "_" 开头目录
            }
            return gulp.src(inputSrc, { base: inputDir })
                .pipe(plugins.plumber())
                .pipe(changedDeps(outputDir, { syntax: 'nunjucks', base: inputDir }))
                .pipe(plugins.nunjucks.compile(TASK_CONFIG.nunjucks))
                .pipe(gulp.dest(outputDir));
        };
    };

    if (TASK_CONFIG.multiple) { // 以子目录为单位
        glob.sync(path.join(src, '*/')).forEach(function (dir) {
            var dirname = path.relative(src, dir);
            var dirDest = path.join(dest, dirname);
            var htmlCompileTaskName = 'html:compile(' + dirname + ')';
            var htmlSrc = path.join(dir, '**/*.html');
            htmlCompileTasks.push({ src: htmlSrc, name: htmlCompileTaskName }); // 用于监听
            gulp.task(htmlCompileTaskName, getHtmlCompileTask(dir, dirDest)); // 定义HTMl编译任务

        });
    } else {
        var htmlCompileTaskName = 'html:compile';
        var allHtmlSrc = path.join(src, '**/*.html');
        htmlCompileTasks.push({ src: allHtmlSrc, name: htmlCompileTaskName }); // 用于监听
        gulp.task(htmlCompileTaskName, getHtmlCompileTask(src, dest)); // 定义HTMl编译任务
    }
    
    var tasks = [];
    htmlCompileTasks.forEach(function (task) {
        gulp.watch(task.src, [task.name]); // 启动HTML编译监听
        tasks.push(task.name);
    });
    tasks.push(done);
    runSequence.apply(runSequence, tasks); // 默认执行一次所有任务
});

gulp.task('html:build', function (done) {

    var getHtmlCompileTask = function (inputDir, outputDir) {

        return function () {
            var inputSrc = [path.join(inputDir, '**/*.html')];
            if (!PROJECT_CONFIG.debug) {
                inputSrc.push('!' + path.join(inputDir, '_*/**/*.html')); // 非 debug 模式已出以 "_" 开头目录
            }
            return gulp.src(inputSrc, { base: inputDir })
                .pipe(plugins.plumber())
                .pipe(plugins.nunjucks.compile(TASK_CONFIG.nunjucks))
                .pipe(gulp.dest(outputDir));
        };
    };

    if (TASK_CONFIG.multiple) { // 以子目录为单位
        glob.sync(path.join(src, '*/')).forEach(function (dir) {
            var dirname = path.relative(src, dir);
            var dirDest = path.join(dest, dirname);
            var htmlCompileTaskName = 'html:compile(' + dirname + ')';
            var htmlSrc = path.join(dir, '**/*.html');
            htmlCompileTasks.push({ src: htmlSrc, name: htmlCompileTaskName }); // 用于监听
            gulp.task(htmlCompileTaskName, getHtmlCompileTask(dir, dirDest)); // 定义HTMl编译任务

        });
    } else {
        var htmlCompileTaskName = 'html:compile';
        var allHtmlSrc = path.join(src, '**/*.html');
        htmlCompileTasks.push({ src: allHtmlSrc, name: htmlCompileTaskName }); // 用于监听
        gulp.task(htmlCompileTaskName, getHtmlCompileTask(src, dest)); // 定义HTMl编译任务
    }
    
    var tasks = [];
    htmlCompileTasks.forEach(function (task) {
        tasks.push(task.name);
    });
    tasks.push(done);
    runSequence.apply(runSequence, tasks); // 默认执行一次所有任务
});
