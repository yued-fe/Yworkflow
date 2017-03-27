/**
 * 处理其他静态资源
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.static;
var path = require('path');

// var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
// var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var changedDeps = require('./plugins/gulp-changed-deps/');

var staticFiles = [];
var staticTasks = [];
Object.keys(TASK_CONFIG.copyDirect).forEach(function (key) {
    var src = path.join(PROJECT_ABS_PATH, key);
    var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.copyDirect[key]);

    var taskName = 'static(' + key + ')';
    staticFiles.push(src);
    staticTasks.push(taskName);
    // 将处理文件全部拷贝到输出目录
    gulp.task(taskName, function () {
        return gulp.src(src)
            .pipe(plugins.changed(dest))
            .pipe(gulp.dest(dest));
    });
});



// 将处理文件全部拷贝到输出目录
gulp.task('static', function(done) {
    if (PROJECT_CONFIG.debug) {
        // 监听文件，触发文件拷贝
        gulp.watch(staticFiles, staticTasks);
    }
    runSequence(staticTasks, done);
});


