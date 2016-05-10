/**
 *
 * 处理精灵图片
 * Author: Luolei
 */


var gulp = require('gulp');

var del = require('del');
var rename = require('gulp-rename');



var chalk = require('chalk'); //美化日志
var plumber = require("gulp-plumber");

// var imagemin = require('gulp-imagemin'); //十分大
// var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var vinylPaths = require('vinyl-paths');

var PATHS = {
    spritesOriginalFiles: 'src/**/sprites/*.png'
}


/**
 * 自动生成@2x图片精灵
 * $ gulp sprite
 * algorithm排列有top-down,left-right,diagonal,alt-diagonal,binary-tree五种方式，根据需求选择
 * 参考:https://github.com/Ensighten/spritesmith#algorithms
 * 此task生成的为@2x的高清图
 */


gulp.task('retinasprite', function(cb) {
    // del(['assets/images/*.png'], function() {
    //     console.log(chalk.red('[清理] 删除旧有精灵'))
    // });
    console.log('开始生成精灵图');
    console.log(path.dirname);
    var spriteData = gulp.src(PATHS.spritesOriginalFiles)
        .pipe(spritesmith({
            imgName: 'sprite@2x.png',
            cssName: '_sprite.scss',
            algorithm: 'binary-tree',
            padding: 10 //建议留白10像素
        }))

    spriteData.img.pipe(gulp.dest('build')) // 输出合成图片
    spriteData.css.pipe(gulp.dest('build'))
    console.log(chalk.green('[缩略] 生成高清图'))
});


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
