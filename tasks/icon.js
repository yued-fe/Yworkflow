/**
 * icon图标相关
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置


if (!PROJECT_CONFIG.tasks.icon) {
    return;
}

var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.icon;

var imgConfig = TASK_CONFIG.img;
var svgConfig = TASK_CONFIG.svg;

var path = require('path');
var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);
var absoluteRootDest = path.resolve(path.join(PROJECT_ABS_PATH,PROJECT_CONFIG.root.dest));

var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var changedDeps = require('./plugins/gulp-changed-deps/');
var svgTransport = require('./plugins/gulp-svg-transport/');

var imgResizeTasks = [];
var imgSpriteTasks = [];
var svgSpriteTasks = [];

// 判断是否是CSS文件
var isCssFile = function (file) {
    return path.extname(file.path) === '.css';
};

// 生成图片压缩任务
var getImgResizeTask = function (input, outputDir) {
    return function () {
        return gulp.src(input)
            .pipe(plugins.changed(outputDir))
            .pipe(plugins.plumber())
            .pipe(plugins.imageResize(imgConfig.imageResize))
            .pipe(gulp.dest(outputDir));
    };
};

// 生成图片合并任务
var getImgSpriteTask = function (input, outputDir) {
    return function () {
        return gulp.src(input, { dot: true })
            .pipe(plugins.newer(path.join(outputDir, imgConfig.spritesmith.imgName)))
            .pipe(plugins.plumber())
            .pipe(plugins.spritesmith(imgConfig.spritesmith))
            .pipe(gulp.dest(outputDir))
            .pipe(plugins.if(isCssFile, plugins.cssUrlToAbsolute({ root: absoluteRootDest })))
            .pipe(gulp.dest(outputDir));
    };
};

// 生成SVG合并任务
var getSvgSpriteTask = function (input, outputDir) {
    return function () {
        return gulp.src(input)
            .pipe(plugins.newer(path.join(outputDir, svgConfig.rename)))
            .pipe(plugins.plumber())
            .pipe(plugins.svgmin(svgConfig.svgmin))
            .pipe(plugins.svgstore(svgConfig.svgstore))
            .pipe(svgTransport(svgConfig.svgTransport))
            .pipe(plugins.rename(svgConfig.rename))
            .pipe(gulp.dest(outputDir));
    };
};


if (TASK_CONFIG.multiple) { // 以子目录为单位
    glob.sync(path.join(src, '*/')).forEach(function (dir) {
        var dirname = path.relative(src, dir);
        var dirDest = path.join(dest, dirname);

        if (imgConfig) {
            var imgResizeTaskName = 'icon:img:resize(' + dirname + ')';
            var imgSpriteTaskName = 'icon:img:sprite(' + dirname + ')';

            var img2xDir = dir;
            var img1xDir = path.join(src, dirname, imgConfig['1xDir']);

            var imgAllSrc = path.join(img2xDir, '**/*.{png,PNG}');
            var img1xSrc = path.join(img1xDir, '**/*.{png,PNG}');
            var img2xSrc = [imgAllSrc, '!' + img1xSrc]; // img2xSrc 会包含 img1xSrc, 在这里排除

            imgResizeTasks.push({ src: img2xSrc, name: imgResizeTaskName }); // 用于监听
            gulp.task(imgResizeTaskName, getImgResizeTask(img2xSrc, img1xDir)); // 定义图片压缩任务

            imgSpriteTasks.push({ src: imgAllSrc, name: imgSpriteTaskName }); // 用于监听
            gulp.task(imgSpriteTaskName, getImgSpriteTask(imgAllSrc, dirDest)); // 定义图片合并任务
        }

        if (svgConfig) {
            var svgSpriteTaskName = 'icon:svg:sprite(' + dirname + ')';
            var svgSrc = path.join(dir, '**/*.{svg,SVG}');
            svgSpriteTasks.push({ src: svgSrc, name: svgSpriteTaskName }); // 用于监听
            gulp.task(svgSpriteTaskName, getSvgSpriteTask(svgSrc, dirDest)); // 定义SVG合并任务
        }
    });
} else {
    if (imgConfig) {
        var allImgResizeTaskName = 'icon:img:resize';
        var allImgSpriteTaskName = 'icon:img:sprite';

        var allImg2xDir = src;
        var allImg1xDir = path.join(src, imgConfig['1xDir']);

        var allImgAllSrc = path.join(allImg2xDir, '**/*.{png,PNG}');
        var allImg1xSrc = path.join(allImg1xDir, '**/*.{png,PNG}');
        var allImg2xSrc = [allImgAllSrc, '!' + allImg1xSrc]; // allImg2xSrc 会包含 allImg1xSrc, 在这里排除

        imgResizeTasks.push({ src: allImg2xSrc, name: allImgResizeTaskName }); // 用于监听
        gulp.task(allImgResizeTaskName, getImgResizeTask(allImg2xSrc, allImg1xDir)); // 定义图片压缩任务

        imgSpriteTasks.push({ src: allImgAllSrc, name: allImgSpriteTaskName }); // 用于监听
        gulp.task(allImgSpriteTaskName, getImgSpriteTask(allImgAllSrc, dest)); // 定义图片合并任务
    }

    if (svgConfig) {
        var allSvgSpriteTaskName = 'icon:svg:sprite';

        var allSvgSrc = path.join(src, '**/*.{svg,SVG}');

        svgSpriteTasks.push({ src: allSvgSrc, name: allSvgSpriteTaskName }); // 用于监听
        gulp.task(allSvgSpriteTaskName, getSvgSpriteTask(allSvgSrc, dest)); // 定义SVG合并任务
    }
}

gulp.task('icon', function (done) {
    var preTasks = [];
    var tasks = [];
    console.log(imgConfig)
    imgResizeTasks.forEach(function (task) {
        if (PROJECT_CONFIG.debug) {
            var watcher = gulp.watch(task.src, [task.name]); // 启动图片压缩监听
            watcher.on('change', function (event) {
                var img1xSrc;
                if (event.type === 'renamed') {
                    img1xSrc = path.join(path.dirname(event.path), imgConfig['1xDir'], path.basename(event.old));
                    del.sync(img1xSrc, { dot: true, force: true });
                } else if (event.type === 'deleted') {
                    img1xSrc = path.join(path.dirname(event.path), imgConfig['1xDir'], path.basename(event.path));
                    del.sync(img1xSrc, { dot: true, force: true });
                }
            });
        }
        preTasks.push(task.name);
    });

    imgSpriteTasks.forEach(function (task) {
        PROJECT_CONFIG.debug && gulp.watch(task.src, [task.name]); // 启动图片合并监听
        tasks.push(task.name);
    });

    svgSpriteTasks.forEach(function (task) {
        PROJECT_CONFIG.debug && gulp.watch(task.src, [task.name]); // 启动SVG合并监听
        tasks.push(task.name);
    });
    runSequence(preTasks, tasks, done); // 默认执行一次所有任务
});
