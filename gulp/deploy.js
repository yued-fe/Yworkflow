/**
 * 发布到ftp服务器演示用
 * Author: Luolei
 */
'use strict'

var fs = require('fs');
var _ = require('underscore');


var PROJECT_CONFIG = require('../.yconfig'); //载入项目基础配置
var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk'); // 美化日志
var combo = require('gulp-combo');
var prettify = require('gulp-jsbeautifier');
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠

var RevAll = require('gulp-rev-custom-tag');
var revReplace = require('gulp-rev-replace');
var bust = require('gulp-buster');
var gulpCopy = require('gulp-copy');


var ejs = require('gulp-ejs');
var gutil = require('gulp-util');


const envType = "local"; //全局环境
var serverConf = require('../src/node-config/server');
var staticConf = serverConf[envType]['static'];
var ftp = require('vinyl-ftp');

var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};



var conn = ftp.create({
    host: '10.97.19.100',
    user: 'ftp',
    password: 'Lny4yJTWr3xHxllDoXLTzOm',
    parallel: 10,
    log: gutil.log
});


gulp.task('ftp-static', function(cb) {
    // gulp.src('./_prelease/**/*')
    //     .pipe(ftp({
    //         host: '10.97.19.100',
    //         user: 'ftp',
    //         pass: 'Lny4yJTWr3xHxllDoXLTzOm',
    //         remotePath: '/' + PROJECT_CONFIG.gtimgName
    //     }))
    //     .pipe(gutil.noop());

    gulp.src('./_prelease/**', { base: './_prelease', buffer: false })
        .pipe(conn.newer('/' + PROJECT_CONFIG.gtimgName)) // only upload newer files
        .pipe(conn.dest('/' + PROJECT_CONFIG.gtimgName));



});


gulp.task('ftp-views', function(cb) {

    gulp.src('./_html/**', { base: './_html', buffer: false })
        .pipe(conn.newer('/project/')) // only upload newer files
        .pipe(conn.dest('/project/'));
});
