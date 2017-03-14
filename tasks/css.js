/**
 * CSS相关任务
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.css;


var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var changedDeps = require('./plugins/gulp-changed-deps/');

var src = path.join(PROJECT_ABS_PATH,TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH,TASK_CONFIG.dest);
var sourceMapDes = path.join(PROJECT_ABS_PATH,TASK_CONFIG.sourcemap);
var absoluteRootDest = path.resolve(PROJECT_CONFIG.root.dest);

console.log('CSS项目');
console.log(path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'));

// CSS格式美化
gulp.task('css:css',function(){
	return gulp.src(src + '/**/*.css')
		.pipe(plugins.plumber())
		.pipe(plugins.changed(dest))
		.pipe(plugins.csscomb())
		.pipe(gulp.dest(dest))
		.pipe(plugins.cssUrlToAbsolute({ root: absoluteRootDest }))
		.pipe(gulp.dest(dest));

});

// 编译Scss并格式美化
gulp.task('css:scss', function () {
    return gulp.src(src + '/**/*.scss')
        .pipe(changedDeps(dest, { extension: '.css' }))
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.csscomb())
        .pipe(plugins.sourcemaps.write(sourceMapDes))
        .pipe(gulp.dest(dest))
        .pipe(plugins.cssUrlToAbsolute({ root: absoluteRootDest }))
        .pipe(gulp.dest(dest));
});


// 将CSS路径下其他文件全部拷贝到输出目录
gulp.task('css:copy', function () {
    return gulp.src([src + '/**/*.*', '!' + src + '/**/*.{css,scss}'])
        .pipe(plugins.changed(dest))
        .pipe(gulp.dest(dest));
});

// 监听css变化
gulp.task('css', function (done) {
        // 监听CSS文件
    gulp.watch(path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'), ['css:css','css:scss','css:copy'])
        .on('change',function(event){
            console.log(chalk.green('[文件变化:CSS]' + event.path));
        })
    runSequence(['css:css','css:scss','css:copy'], done);
});


    // runSequence(['css:css'], done);