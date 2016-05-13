var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var combo = require('gulp-combo');
var prettify = require('gulp-jsbeautifier');


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
    gulp.src('build/qd/**')
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
                // prefix: cdnConfig.Domain + pkg.name + '/'
        }))
        .pipe(gulp.dest('_previews'))
        cb()
});

/**
 * 为了方便本地模拟读取静态资源的服务url根路径,临时将静态资源复制到_tmp目录下
 * 这是一个坑,需要解决
 */

gulp.task('copy',function(){
        // del(['_tmp/**/*'])
        gulp.src('_prelease/**/*')
        .pipe(gulp.dest('./_tmp/qd'))
        // cb()
})

/**
 * 生成不需要增加版本号的静态资源,直接将编译后的静态资源复制到_prelease目录
 */
gulp.task('copy-no-rev',function(){
        // del(['_tmp/**/*'])
        gulp.src('build/**/*')
        .pipe(gulp.dest('_prelease'))
        // cb()
})