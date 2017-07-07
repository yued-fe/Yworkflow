'use strict'

var PROJECT_CONFIG = require('../yworkflow'); //载入项目基础配置
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var path = require('path');
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function () {
    return del([path.join(PROJECT_CONFIG.absPath,PROJECT_CONFIG.root.dest)], { dot: true, force: true });
});
