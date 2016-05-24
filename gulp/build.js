/**
 * 发布和编译
 * Author: Luolei
 */

var PROJECT_CONFIG = require('../.yconfig'); //载入项目基础配置
var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk'); // 美化日志
var combo = require('gulp-combo');
var prettify = require('gulp-jsbeautifier');
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠

var RevAll = require('gulp-rev-custom-tag');
var revReplace = require('gulp-rev-replace');
var bust = require('gulp-buster');
var gulpCopy = require('gulp-copy');

var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};

/**
 * 生成带版本号的静态文件
 */

gulp.task('rev', function(cb) {
    var revAll = new RevAll({
        prefix: '', //自动增加url路径
        dontRenameFile: [/^\/favicon.ico$/g, '.html', '.json'],
        hashLength: 5,
        hashTagMapPath:'hash-tag-map' //这里可以自定义配置hashTag映射表的目录
    });
    var ignoredFiles = {
        // sprites:paths.dist.
    };
    gulp.src('build/' + PROJECT_CONFIG.gtimgName + '/**')
        .pipe(revAll.revision())
        .pipe(gulp.dest('_prelease'))
        .pipe(revAll.manifestFile()) //创建静态资源hash映射表
        .pipe(gulp.dest('hash-tag-map'))
        .pipe(revAll.verionIdFile())  //创建递增id映射表
        .pipe(gulp.dest('hash-tag-map'))
    cb()
});

/**
 * 二次替换,防止js和css中有url没有被替换
 */

gulp.task('rev-fix' ,function() {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src(['_prelease/**/*.{js,ejs,css}']) // Minify any CSS sources
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_prelease'))
});


/**
 * 替换模板文件中的静态资源引入路径
 */
gulp.task('rev-views', function(cb) {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src("src/views/**/*.html") // Minify any CSS sources
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_previews'))
        cb()
});


/**
 * ARS在发布模板的同时,顺便把node-config发布到同一目录(ars就不用重复建单)
 */

gulp.task('copy-config',function(){
        console.log(chalk.red('复制[node-config]配置文件到 _previews/ 目录' ));
        gulp.src('src/node-config/**/*')
        .pipe(gulp.dest('./_previews/node-config'))
})


/**
 * 生成不需要增加版本号的静态资源,直接将编译后的静态资源复制到_prelease目录
 * 本地调试用
 */
gulp.task('copy-no-rev',function(){
        // del(['_tmp/**/*'])
        gulp.src('build/**/*')
        .pipe(gulp.dest('_prelease'))
        // cb()
})