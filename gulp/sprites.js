/**
 *
 * 处理精灵图片
 * Author: Luolei
 */

var PROJECT_CONFIG = require('../.yconfig');
var gulp = require('gulp');

var del = require('del');
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');

var chalk = require('chalk'); //美化日志
var plumber = require("gulp-plumber");

// var imagemin = require('gulp-imagemin'); //十分大
// var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var vinylPaths = require('vinyl-paths');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var folders = require('gulp-folders');
var PATHS = {
    spritesOriginalFiles: 'src/**/*/sprites/**/*.{png,PNG}'
}



var spritesFolder = [];


gulp.task('demos', function(cb) {
    var _currentFolderPath = __dirname.split('/');
    _srcFolderPath = _currentFolderPath.slice(0, _currentFolderPath.length - 1).join('/') + '/src/static';

    console.log(_srcFolderPath);
    return gulp.src(PATHS.spritesOriginalFiles)
        .pipe(plumber())
        .pipe(vinylPaths(function(paths) {
            var _relativeFilePath = paths.replace(_srcFolderPath,'');
            // console.log('Paths:', _relativeFilePath);
            var _thisFileName = _relativeFilePath.split('/').pop();
            // console.log(_thisFileName);
            _relativeSpriteFolder = _relativeFilePath.replace('sprites/' + _thisFileName,'');
            if(spritesFolder.indexOf(_relativeSpriteFolder)  == -1 ){
                spritesFolder.push(_relativeSpriteFolder);
            }
            // console.log(spritesFolder);
            return Promise.resolve();
        })).on('en',cb)

})




// directory
var dir = {
    source: 'src/' + PROJECT_CONFIG.gtimgName + '/images/sprites',
    scss: 'src/' + PROJECT_CONFIG.gtimgName + '/css',
    img: PROJECT_CONFIG.gtimgName + '/images/sprites',
    sprite: PROJECT_CONFIG.gtimgName + '/sprite'
};

/**
 * 获得文件的目录
 */

var getFolders = function(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


var scriptsPath = 'src/static/qd/sprites'; // folder to process





// task.sprites
gulp.task('spp',['demos'], function(cb) {
    var _totalSpritesToGenerateSize = spritesFolder.length;
    console.log(chalk.green('【精灵图】共有 ') + chalk.red(_totalSpritesToGenerateSize) + chalk.green(' 张@2x精灵图待生成'));
    console.log('测试下:' + spritesFolder);

        var i = 0;
        var spriteData = [],
            spriteDataResize = [];
        for (i; i < _totalSpritesToGenerateSize; i++) {
            console.log('src/static' + spritesFolder[i] + 'sprites/*.png');
            spriteData[i] = gulp.src('src/static' + spritesFolder[i] + 'sprites/*.png')
                .pipe(spritesmith({
                    imgName: 'sprite@2x.png',
                    cssName: 'sprite.scss',
                    algorithm: 'binary-tree',
                    padding: 4,
                    cssFormat: 'scss'
                }));
            var spriteRetina = spriteData[i].img,
                spriteResize = spriteData[i].img;

            var spriteCss = spriteData[i].css
            // console.log(folder + ' 图片 out:' + 'build/' + dir.img + '/' + folder);
            // console.log(folder + ' CSS out:' + 'build/' + dir.sprite + '/' + folder);
            var retianStream = spriteRetina.pipe(gulp.dest('build' + spritesFolder[i] + 'images/sprite'));
            spriteCss.pipe(gulp.dest('build' + spritesFolder[i] + 'css/sprite')).on('end',cb);

        }
        // console.log(chalk.green('[生成高清缩略图]' + 'sprite-' + folder + '@2x.png'));
});
// task.sprites
gulp.task('spp-resize',['demos','spp'], function(cb) {
    var _totalSpritesToGenerateSize = spritesFolder.length;
    console.log(chalk.green('【精灵图】共有 ') + chalk.red(_totalSpritesToGenerateSize) + chalk.green(' 张@1x精灵图待生成'));
    console.log('测试下:' + spritesFolder);

        var i = 0;
        var spriteData = [],
            spriteDataResize = [];
        for (i; i < _totalSpritesToGenerateSize; i++) {
            console.log('src/static' + spritesFolder[i] + 'sprites/*.png');
            spriteData[i] = gulp.src('src/static' + spritesFolder[i] + 'sprites/*.png')
                .pipe(spritesmith({
                    imgName: 'sprite.png',
                    cssName: 'sprite.scss',
                    algorithm: 'binary-tree',
                    padding: 4,
                    cssFormat: 'scss'
                }));
            var spriteRetina = spriteData[i].img,
                spriteResize = spriteData[i].img;

            var spriteCss = spriteData[i].css
            // console.log(folder + ' 图片 out:' + 'build/' + dir.img + '/' + folder);
            // console.log(folder + ' CSS out:' + 'build/' + dir.sprite + '/' + folder);
            var retianStream = spriteRetina.pipe(gulp.dest('build' + spritesFolder[i] + 'images/sprite'));

            //直接生成缩放50%的图片
            var resizeStream = spriteResize.pipe(buffer()).pipe(imageResize({
                width: '50%'
            }))
            .pipe(gulp.dest('build' + spritesFolder[i] + 'images/sprite'))


        }
        // console.log(chalk.green('[生成高清缩略图]' + 'sprite-' + folder + '@2x.png'));
});

/**
 * 自动生成@2x图片精灵
 * $ gulp sprite
 * algorithm排列有top-down,left-right,diagonal,alt-diagonal,binary-tree五种方式，根据需求选择
 * 参考:https://github.com/Ensighten/spritesmith#algorithms
 * 此task生成的为@2x的高清图
 */



// /**
//  * 自动生成@1x图片精灵
//  * 在retinasprite执行后自动生成标清精灵
//  */

// gulp.task('retinasprite', function(cb) {
//     var spriteData = gulp.src('dev/sprites/*.png').pipe(spritesmith({
//         imgName: 'sprite@2x.png',
//         cssName: '_sprite.scss',
//         algorithm: 'binary-tree',
//         padding: 10 //建议留白10像素
//     }));
//     spriteData.img.pipe(gulp.dest('dev/img/')).on('end',cb); // 输出合成图片
//     spriteData.css.pipe(gulp.dest('dev/css/sass/'))
//     console.log(chalk.green('[缩略] 生成高清图'))

// })
// gulp.task('standardsprite',['retinasprite'],function(cb){
//     console.log(chalk.green('[缩略] 生成标清图'))
//     gulp.src('dev/img/sprite@2x.png')
//     .pipe(plumber())
//     .pipe(imageResize({
//             width: '50%'
//     }))
//     .pipe(rename('sprite.png'))
//     .pipe(gulp.dest('dev/img/')).on('end',cb)

// })
// gulp.task('sprite2assets',['retinasprite','standardsprite'],function(){
//     console.log(chalk.green('[转移] 复制精灵图到资源目录'))
//     gulp.src('dev/img/*.png')
//     .pipe(gulp.dest('assets/images/sprites/'))
//     .pipe(gulp.dest('public/assets/images/sprites/'))
// })


// gulp.task('sprite', ['retinasprite', 'standardsprite','sprite2assets']);
