/**
 * 处理js
 */
var gulp = require('gulp');
var rename = require('gulp-rename');
var chalk = require('chalk'); //美化日志
var plumber = require("gulp-plumber");
var stylish = require("jshint-stylish");
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// 设置相关路径
var paths = {
    des: 'build',
    js: 'src/**/*.js', //js文件相关目录
};

// JS检查
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function(cb) {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(uglify())
        .pipe(gulp.dest(paths.des))
    cb()
});