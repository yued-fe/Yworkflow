/**
 * 监听图片相关
 */
var gulp = require('gulp');
var chalk = require('chalk'); // 美化日志
var plumber = require("gulp-plumber");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var gulpCopy = require('gulp-copy');
// var paths = {
//     img: ['src/**/*.jpg','src/**/*.png','src/**/*.gif'],// 图片相关
//     sass: 'src/**/*.scss',
//     lbfsass:'static/activity/css/lbfUI/css/sass/*.scss',
//     css: 'build',
//     lbfcss:'static/activity/css/lbfUI/css',
//     prelease:'_prelease'
// };


// // sass task
// gulp.task('images', function() {
//     gulp.src(paths.img)
//         .pipe(plumber())
//         // .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
//         .pipe(gulp.dest(paths.css))

// });


var paths = {
    assets: 'assets',
    sass: 'src/**/*.scss',
    lbfsass: 'static/activity/css/lbfUI/css/sass/*.scss',
    css: 'build',
    lbfcss: 'static/activity/css/lbfUI/css',
    prelease: '_prelease'
};




gulp.task('cleanbuild', function(cb) {
    console.log('执行清理');
    del(['build/**/*'])
    cb()
});


gulp.task('clean', function(cb) {
    console.log('执行清理');
    del(['_tmp/**/*','_prelease/**/*', '_previews/**/*'])
    cb()
});