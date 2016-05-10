var gulp = require('gulp');
var chalk = require('chalk'); // 美化日志
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var image = require('gulp-image');
var del = require('del');

var paths = {
    img: ['src/**/*.jpg','src/**/*.png','src/**/*.gif'],// 图片相关
    sass: 'src/**/*.scss',
    lbfsass:'static/qd/css/lbfUI/css/sass/*.scss',
    build: 'build',
    others:['src/**/*.mp3'],
    prelease:'_prelease'
};


// sass task
gulp.task('images', function(cb) {

    gulp.src(paths.img)
        .pipe(plumber())
        .pipe(image())
        // .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
        .pipe(gulp.dest(paths.build))
    cb();
});

gulp.task('images-copy', function(cb) {

    gulp.src(paths.img)
        .pipe(plumber())
        .pipe(gulp.dest(paths.build))
    cb();
});

gulp.task('sfile',['clean'], function(cb) {
    gulp.src(['src/**/*','!src/**/*.css','!src/**/*.scss','!src/**/*.js','!src/**/*.ejs'])
        // .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
        .pipe(gulp.dest(paths.build))
    cb();
});
