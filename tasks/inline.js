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
var replaceConfig = path.join(PROJECT_ABS_PATH, TASK_CONFIG.replace);
var baseDir = TASK_CONFIG.baseDir;
var htmlPath = path.resolve(PROJECT_ABS_PATH, baseDir, TASK_CONFIG.htmlPath);
var htmlDest = path.resolve(PROJECT_ABS_PATH, baseDir, TASK_CONFIG.htmlDest);



var gulp = require('gulp');
var replace = require('gulp-replace');
var usemin = require('gulp-usemin');
var cleanCss = require('gulp-clean-css');
var eof = require('end-of-stream');
var path = require('path');
var chalk = require('chalk');
var runSequence = require('run-sequence');

gulp.task('inline:replace', function (cb) {
    
    function replaceTask(replaceItem, cb) {
        return function () { eof(
            gulp.src(path.resolve(PROJECT_ABS_PATH, baseDir, replaceItem.src))
                .pipe(replace(replaceItem.replaceFrom, replaceItem.replaceTo))
                .pipe(gulp.dest(path.resolve(PROJECT_ABS_PATH, baseDir, replaceItem.dest))), function () {
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
          inlinecss: [ cleanCss(), 'concat' ]
        }))
        .pipe(gulp.dest(htmlDest));
});


gulp.task('inline', function(done) {
    runSequence('inline:replace', 'inline:usemin',  done);
});


gulp.task('inline:build', function(done) {
    runSequence('inline:replace', 'inline:usemin',  done);
});
