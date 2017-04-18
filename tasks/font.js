var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置

if (!PROJECT_CONFIG.tasks.font) {
    return;
}

var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.font;
var path = require('path');

var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var changedDeps = require('./plugins/gulp-changed-deps/');

var absoluteRootDest = path.resolve(path.join(PROJECT_ABS_PATH,PROJECT_CONFIG.root.dest));

// 判断是否是CSS文件
var isCssFile = function(file) {
    return path.extname(file.path) === '.css';
};

// 字体压缩
gulp.task('font:compress', function() {
    return gulp.src(path.join(src, '**/*.html'))
        .pipe(plugins.plumber())
        .pipe(plugins.fontSpider(TASK_CONFIG.fontSpider));
});

// 字体复制
gulp.task('font:copy', function() {
    return gulp.src([path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'), '!' + path.join(src, '**/.font-spider/*')])
        .pipe(plugins.changed(dest))
        .pipe(plugins.plumber())
        .pipe(gulp.dest(dest))
        .pipe(plugins.if(isCssFile, plugins.cssUrlToAbsolute({
            root: absoluteRootDest
        }))) // CSS相对地址转绝对地址
        .pipe(gulp.dest(dest));
});

gulp.task('font', function(done) {
    // 监听html文件，触发字体压缩
    gulp.watch(path.join(src, '**/*.html'), ['font:compress']);
    // 监听字体文件，触发字体复制
    gulp.watch(path.join(src, '**/*.{' + TASK_CONFIG.extensions.join(',') + '}'), ['font:copy']);

    // 默认执行一次字体复制
    runSequence('font:copy', done);
});
