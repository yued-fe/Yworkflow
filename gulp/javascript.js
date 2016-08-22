/**
 * 处理js
 */
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER);

var PROJECT_CONFIG = require('../../.yconfig');
var gulp = require('gulp');
var rename = require('gulp-rename');
var chalk = require('chalk'); //美化日志
var plumber = require("gulp-plumber");
var stylish = require("jshint-stylish");
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');



// 设置相关路径
var paths = {
    des: 'build',
    js: 'src/static/**/*.js', //js文件相关目录
};

// JS检查
gulp.task('lint', function() {
    console.log('检查');
    return gulp.src(paths.js)
     .pipe(gulpSlash())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function(cb) {
    gulp.src(paths.js)
     .pipe(gulpSlash())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(gulp.dest(paths.des))
    cb()
});