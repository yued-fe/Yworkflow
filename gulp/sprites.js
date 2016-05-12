/**
 *
 * 处理精灵图片
 * Author: Luolei
 */


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
var folders = require('gulp-folders');
var PATHS = {
    spritesOriginalFiles: 'src/**/sprites/*.png'
}


// directory
var dir = {
    source: 'src/qd/images/sprites',
    scss: 'src/qd/css',
    img: 'qd/images/sprites',
    sprite: 'qd/sprite'
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


var scriptsPath = 'src/qd/images/sprites'; // folder to process


// task.sprites
gulp.task('spp', function() {
    // set target folders
    var folders = getFolders(scriptsPath);
    var iii = 1;
    // generate image & sass files
    folders.map(function(folder) {
        console.log('===== '+iii);
        iii += 1;
        console.log('原始路径:' + 'src/qd/images/sprites/' + folder + '/*.png');
        // console.log('src/qd/images/sprites' + folder + '.png');
        var spriteData = gulp.src('src/qd/images/sprites/' + folder + '/*.png')
            .pipe(spritesmith({
                imgName: 'sprites-' + folder + '@2x.png',
                cssName: folder + '-sprite' + '.scss',
                algorithm: 'binary-tree',
                padding: 4,
                cssFormat: 'scss'
            }));
        console.log(folder + '图片out:' + 'build/'+ dir.img + '/' + folder);
        console.log(folder + 'CSS out:' + 'build/' + dir.sprite + '/' + folder);
        spriteData.img.pipe(gulp.dest('build/'+ dir.img + '/' + folder));
        spriteData.css.pipe(gulp.dest('build/' + dir.sprite + '/' + folder));
    });
});






/**
 * 自动生成@2x图片精灵
 * $ gulp sprite
 * algorithm排列有top-down,left-right,diagonal,alt-diagonal,binary-tree五种方式，根据需求选择
 * 参考:https://github.com/Ensighten/spritesmith#algorithms
 * 此task生成的为@2x的高清图
 */



gulp.task('retinasprite', function(cb) {
    console.log('开始生成精灵图');
    var spriteData = gulp.src('src/qd/images/sprites/free/*.png')
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
