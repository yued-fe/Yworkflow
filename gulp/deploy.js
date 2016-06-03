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

// PROJECT_CONFIG.ftp.host

var conn = ftp.create({
    host: PROJECT_CONFIG.ftp.host,
    user: PROJECT_CONFIG.ftp.user,
    password: PROJECT_CONFIG.ftp.password,
    parallel: 10,
    log: gutil.log
});






var uploadedStaticPath = '',
    uploadedViewPath = '';



if (!!(gutil.env.previews)) {
     uploadedStaticPath = '_prelease',
        uploadedViewPath = '_html';
} else {
     uploadedStaticPath = 'build/'+ PROJECT_CONFIG.gtimgName,
        uploadedViewPath = '_html';
}

gulp.task('ftp-static', function(cb) {
    // console.log('编译版本' + );

    console.log('上传' + uploadedStaticPath + '目录静态资源');
    console.log('上传' + uploadedViewPath + '目录模板文件');

    console.log('./' + uploadedStaticPath + '/**');
    gulp.src('./' + uploadedStaticPath + '/**', { base: './' + uploadedStaticPath + '/', buffer: false })
        .pipe(conn.newer('/' + PROJECT_CONFIG.gtimgName)) // only upload newer files
        .pipe(conn.dest('/' + PROJECT_CONFIG.gtimgName));

});


gulp.task('ftp-views', function(cb) {

    gulp.src('./' + uploadedViewPath + '/**', { base: './' + uploadedViewPath, buffer: false })
        .pipe(conn.newer('/project/')) // only upload newer files
        .pipe(conn.dest('/project/'));
});
