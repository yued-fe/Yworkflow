/**
 * 内联相关的任务
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置

if (!PROJECT_CONFIG.tasks.inline) {
    return;
}

var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.inline;
var path = require('path');

// prereplace task
var replaceConfig = TASK_CONFIG.replace;
var baseDir = path.resolve(PROJECT_ABS_PATH, TASK_CONFIG.baseDir);
var htmlPath = path.resolve(baseDir, TASK_CONFIG.htmlPath);
var htmlDest = path.resolve(baseDir, TASK_CONFIG.htmlDest);

var gulp = require('gulp');
var replace = require('gulp-replace');
var usemin = require('gulp-usemin');
var cleanCss = require('gulp-clean-css');
var eos = require('end-of-stream');
var chalk = require('chalk');
var runSequence = require('run-sequence');

// 因为inline之前基本都需要一个替换的动作,所以inline前先执行一个replace的操作
gulp.task('inline:replace', function (cb) {
    
    function replaceTask(replaceItem, cb) {
        var srcPath = path.resolve(baseDir, replaceItem.src);
        var destPath = path.resolve(baseDir, replaceItem.dest);
        var patterns = replaceItem.patterns;
        var patternKeys = Object.keys(patterns);
        function patternTask(task, from, to) {
           return task.pipe(replace(from, to));
        }
        return function () { eos(
            (function () {
                var task = gulp.src(srcPath);
                patternKeys.forEach(function (key) {
                    task = patternTask(task, key, patterns[key]); 
                });
                task.pipe(gulp.dest(destPath));
                return task;
            })(), function (err) {
                if(err) return console.error(err);
                cb();
            }
        )}
    }
    var task = null;
    for(var i = replaceConfig.length - 1; i >= 0; i--) {
        if(!task) {
            task = replaceTask(replaceConfig[i], cb);
        } else {
            task = replaceTask(replaceConfig[i], task);
        }
    }
    task();
});

gulp.task('inline:usemin', function () {
    
    return gulp.src(htmlPath)
        .pipe(usemin({
          inlinecss: [ cleanCss, 'concat' ],
          path: baseDir
        }))
        .pipe(gulp.dest(htmlDest));
});


gulp.task('inline', function(done) {
    // 如果有replace则执行replace
    if(replaceConfig.replace) {
        runSequence('inline:replace', 'inline:usemin', done);
    } else {
        runSequence('inline:usemin', done);
    }
});

gulp.task('inline:build', function(done) {
    runSequence('inline', done);
});
