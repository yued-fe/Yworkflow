/**
 *
 * 处理精灵图片
 * Author: Luolei
 */

var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER);

var PROJECT_CONFIG = require('../../.yconfig');
var gulp = require('gulp');

var del = require('del');
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠

var chalk = require('chalk'); //美化日志
var plumber = require("gulp-plumber");

// var imagemin = require('gulp-imagemin'); //十分大
// var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var vinylPaths = require('vinyl-paths');
var buffer = require('vinyl-buffer');
var folders = require('gulp-folders');

var PATHS = {
    spritesOriginalFiles: LOCAL_FOLDER + 'src/**/*/sprites/**/*.{png,PNG}'
}


var spritesFolder = [];


gulp.task('get-sprites-folder', function(cb) {
    var _osPath = __dirname;
    _osPath = gulpSlash(_osPath); // 这里处理一下windows下路径的兼容
    var _currentFolderPath = _osPath.split('/');
    _srcFolderPath = _currentFolderPath.slice(0, _currentFolderPath.length - 1).join('/') + '/src/static';

    return gulp.src(PATHS.spritesOriginalFiles)
        .pipe(plumber())
        .pipe(gulpSlash())
        .pipe(vinylPaths(function(paths) {
            var _relativeFilePath = paths.replace(_srcFolderPath, '');
            var _thisFileName = _relativeFilePath.split('/').pop();
            _relativeSpriteFolder = _relativeFilePath.replace('sprites/' + _thisFileName, '');
            if (spritesFolder.indexOf(_relativeSpriteFolder) == -1) {
                spritesFolder.push(_relativeSpriteFolder);
            }
            // console.log('需要生成精灵图的文件夹包含:' + spritesFolder);
            return Promise.resolve();
        })).on('en', cb)

})



/**
 * 遍历src/static 下的所有含{sprites}的目录，根据相对层级，在build目录生成之后的精灵图和scss
 */

gulp.task('retina-sprites-build', ['get-sprites-folder'], function(cb) {
    var _totalSpritesToGenerateSize = spritesFolder.length;
    console.log(chalk.green('【精灵图】共有 ') + chalk.red(_totalSpritesToGenerateSize) + chalk.green(' 张@2x精灵图待生成'));
    var i = 0;
    var spriteData = [],
        spriteDataResize = [];
    for (i; i < _totalSpritesToGenerateSize; i++) {
        console.log(spritesFolder[i] + 'sprites/*.png');
        var _thisSpriteMaster = spritesFolder[i].split('/').slice(0, spritesFolder[i].split('/').length - 1).pop();
        spriteData[i] = gulp.src(spritesFolder[i] + 'sprites/*.png')
            .pipe(gulpSlash())
            .pipe(spritesmith({
                imgName: '@2x.png',
                cssName: _thisSpriteMaster + '_sprite.scss',
                algorithm: 'binary-tree',
                padding: 4,
                cssFormat: 'scss'
            }));
        var spriteRetina = spriteData[i].img,
            spriteResize = spriteData[i].img;
        var spriteCss = spriteData[i].css;
        console.log('DEMO:'  + spritesFolder[i] + '/sprite');
        var retianStream = spriteRetina.pipe(gulp.dest(spritesFolder[i] + '/sprite'));

        var cssStream = spriteCss.pipe(gulp.dest('src/static/' + PROJECT_CONFIG.gtimgName + '/css'));

    }
    cb()
});


/**
 * 压缩@2x高清图,生成标清@1x图
 */

gulp.task('standard-sprites-build', ['get-sprites-folder', 'retina-sprites-build'], function(cb) {
    var _totalSpritesToGenerateSize = spritesFolder.length;
    console.log(chalk.green('【精灵图】共有 ') + chalk.red(_totalSpritesToGenerateSize) + chalk.green(' 张@1x精灵图待生成'));

    var i = 0;
    var resizeSpriteData = [],
        spriteDataResize = [];
    for (i; i < _totalSpritesToGenerateSize; i++) {
        // console.log('src/static' + spritesFolder[i] + 'sprites/*.png');
        console.log(spritesFolder[i] + 'sprite/@2x.png');
        gulp.src(spritesFolder[i] + 'sprite/@2x.png')
            .pipe(gulpSlash())
            .pipe(imageResize({
                width: '50%'
            }))
            .pipe(rename('@1x.png'))
            .pipe(gulp.dest( spritesFolder[i] + '/sprite'))



    }
    console.log(chalk.green('======[生成精灵缩略图]======'));
});
