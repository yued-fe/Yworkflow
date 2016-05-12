/*
 * Author:luolei
 */

//引入 gulp
var gulp = require('gulp');
var requireDir = require('require-dir');
var nodemon = require('gulp-nodemon'); // node watch

var pkg = require('./package.json'); // 获得配置文件中相关信息
var plumber = require("gulp-plumber"); // 错误处理
var chalk = require('chalk'); // 美化日志


requireDir('./gulp');

// 设置相关路径
var paths = {
    css: ['src/static/**/*.scss', 'src/**/*.css'],
    js: ['src/static/**/*.js'], // js文件相关目录
    sass: 'src/static/**/*.scss',
    img: ['src/static/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}'] // 图片相关
};


function gulpWatch() {
        gulp.watch(paths.js, ['scripts']);
        gulp.watch(paths.css, ['sass']);
        gulp.watch(paths.img, ['images-copy']);
}

var watching = false;

gulp.task('browserSync', ['dev'], function() {
    browserSync.init(null, {
        proxy: {
            host: "http://localhost",
            port: "3235"
        }
    });
});

// 启动 Nodemon 服务
gulp.task('dev', function() {
    nodemon({
            script: 'index.js',
            ext: 'js html scss css',
            ignore: ['ejs', 'src/**/*', 'build', '_tmp', '_prelease', '_previews'],
            env: {
                "NODE_ENV": process.env.NODE_ENV
            }
        })
        .on('start', function() {
            console.log(chalk.red('watch状态') + watching);
            if (!watching) {
                gulpWatch()
                watching = true;
            }
        })
        .on('change', function() {
            if (!watching) {
                gulpWatch();
                watching = true;
            }
        })
        .on('restart', function(changedFiles) {
            console.log(chalk.red('watch状态') + watching);
            changedFiles.forEach(function(file) {
                console.log(chalk.red('[文件变动]') + chalk.green(file));
            });
            if (!watching) {
                gulpWatch();
                watching = true;
            }
            console.log(chalk.green('[nodemon] 服务重新启动'));
        })
});

// gulp
gulp.task('default', ['watch', 'scripts']);
//进行编译
gulp.task('build', ['cleanbuild', 'sass', 'scripts','sfile']);
//创建带版本号的静态资源
gulp.task('build-static', ['clean', 'rev','rev-fix-url']);
//创建替换所有静态资源
gulp.task('build-views', ['rev-views', 'rev-fix-url', 'copy']);
