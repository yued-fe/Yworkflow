/**
 * Author:luolei
 */

var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow')[0] + '/';
console.log(__dirname.split('Yworkflow')[0]);
var PROJECT_CONFIG = require('../.yconfig'); //载入项目基础配置

//引入 gulp
var gulp = require('gulp');
var requireDir = require('require-dir');
var nodemon = require('gulp-nodemon'); // node watch
var pkg = require('./package.json'); // 获得配置文件中相关信息
var plumber = require("gulp-plumber"); // 错误处理
var chalk = require('chalk'); // 美化日志


requireDir('./gulp');

// 设置相关路径
console.log(LOCAL_FOLDER + 'src/static/**/*.js');
var paths = {
    css: [LOCAL_FOLDER + 'src/static/**/*.scss',LOCAL_FOLDER +  'src/**/*.css'],
    js: [LOCAL_FOLDER + 'src/static/**/*.js'], // js文件相关目录
    sass: LOCAL_FOLDER + 'src/static/**/*.scss',
    img: [LOCAL_FOLDER + 'src/static/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}'] // 图片相关
};


/**
 * 开发的过程中,监听src/目录下的sass、js等静态资源,进行编译处理
 */

var watching = false;

function gulpWatch() {
        gulp.watch(paths.js, ['scripts']);
        gulp.watch(paths.css, ['sass']);
        gulp.watch(paths.img, ['images-copy']);
}

/**
 * 使用Nodemon来监控本地的Node服务,自动重启等
 */

gulp.task('dev', function() {
    nodemon({
            script: 'Yworkflow/index.js',
            ext: 'js html scss css',
            ignore: ['ejs', LOCAL_FOLDER + 'src/static/**/*', LOCAL_FOLDER +'build',LOCAL_FOLDER + '_prelease',LOCAL_FOLDER + '_previews'],
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



/**
 * 自定义的gulp任务,可以单独执行 gulp {task}来执行相关任务
 */

// gulp
gulp.task('default', ['watch', 'scripts']);
//进行编译
gulp.task('build', ['sass', 'scripts','sfile']);
//创建带版本号的静态资源
gulp.task('build-static', ['clean', 'rev','rev-fix-url']);
//创建替换所有静态资源
gulp.task('build-views', ['rev-views', 'rev-fix-url', 'copy']);

gulp.task('auto-sprite', ['get-sprites-folder', 'retina-sprites-build','standard-sprites-build']);
