/**
 * 处理图片相关
 * Author: Luolei
 */
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER);

var PROJECT_CONFIG = require('../../.yconfig');
var gulp = require('gulp');
var chalk = require('chalk'); // 美化日志
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var image = require('gulp-image');
var del = require('del');

var folders = require('gulp-folders');

var paths = {
    img: ['src/static/**/*.{jpg,JPG,png,PNG,gif,GIF}','!**/sprites/*'],// 图片相关
    sass: 'src/static/**/*.scss',
    build: 'build',
    others:['src/static/**/*.mp3'],
    prelease:'_prelease'
};


// sass task
gulp.task('images', function(cb) {

    gulp.src(paths.img)
     .pipe(gulpSlash())
        .pipe(plumber())
        .pipe(image())
        .pipe(gulp.dest(paths.build))
    cb();
});

gulp.task('images-copy', function(cb) {

    gulp.src(paths.img)
     .pipe(gulpSlash())
        .pipe(plumber())
        .pipe(gulp.dest(paths.build))
    cb();
});

gulp.task('sfile', function(cb) {
    gulp.src(['src/static/**/*','!src/static/**/*.{css,scss,js}','!src/static/**/sprites','!src/static/**/sprites/**'])
     .pipe(gulpSlash())
        .pipe(gulp.dest(paths.build))
    cb();
});
