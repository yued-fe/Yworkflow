/**
 * 清理临时文件
 * Author: Luolei
 */
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER)

var PROJECT_CONFIG = require('../../.yconfig'); //载入项目基础配置
var gulp = require('gulp');
var chalk = require('chalk'); // 美化日志
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var gulpCopy = require('gulp-copy');


var paths = {
    sass: 'src/**/*.scss',
    css: 'build',
    prelease: '_prelease'
};


gulp.task('cleanbuild', function(cb) {
    console.log(chalk.red('清理build目录'));
    del(['build/'])
    cb()
});


gulp.task('clean', function(cb) {
    console.log(chalk.red('[清理]删除上一次编译文件'));
    del(['_prelease/', '_previews/','build/','_tmp/'])
    cb()
});

gulp.task('clean-ana', function(cb) {
    console.log(chalk.red('[清理]删除依赖分析过程中生成的临时文件'));
    del(['hash-tag-map/deps.json', 'hash-tag-map/js-list.json','hash-tag-map/rev-HashMap-last.json','hash-tag-map/reverse-js.json'])
    cb()
});