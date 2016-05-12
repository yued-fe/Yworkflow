/**
 * 清理临时文件
 * Author: Luolei
 */

var gulp = require('gulp');
var chalk = require('chalk'); // 美化日志
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var gulpCopy = require('gulp-copy');


var paths = {
    assets: 'assets',
    sass: 'src/**/*.scss',
    css: 'build',
    prelease: '_prelease'
};



gulp.task('cleanbuild', function(cb) {
    console.log(chalk.red('清理build目录'));
    del(['build/**/*'])
    cb()
});


gulp.task('clean', function(cb) {
    console.log(chalk.red('清理预览目录'));
    del(['_tmp/**/*','_prelease/**/*', '_previews/**/*'])
    cb()
});