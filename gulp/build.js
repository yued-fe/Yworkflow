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
    assets: 'assets',
    sass: 'src/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};


/**
 * 生成时间戳 MD5 combo等任务
 * $ gulp build
 *
 */



gulp.task('rev', ['clean','sfile'], function(cb) {

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
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('hash-tag-map'))
        .pipe(revAll.verionIdFile())
        .pipe(gulp.dest('hash-tag-map'))
    cb()
});


gulp.task('copy',['rev-views','rev-fix'],function(){
        // del(['_tmp/**/*'])
        gulp.src('_prelease/**/*')
        .pipe(gulp.dest('./_tmp/qd'))
        // cb()
})


/**
 * 更换模板中的相关变量
 */
gulp.task('rev-views', function(cb) {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src("views/**/*.html") // Minify any CSS sources
        .pipe(revReplace({
            manifest: manifest
                // prefix: cdnConfig.Domain + pkg.name + '/'
        }))
        .pipe(gulp.dest('_previews'))
        cb()
});

/**
 * 这部很关键,二次替换,防止js和css中有url没有被替换
 */
gulp.task('rev-fix-url',function() {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src(['_prelease/**/*.js','_prelease/**/*.ejs','_prelease/**/*.css']) // Minify any CSS sources
        .pipe(revReplace({
            manifest: manifest
                // prefix: cdnConfig.Domain + pkg.name + '/'
        }))
        .pipe(gulp.dest('_prelease'))
});


gulp.task('rev-fix',['rev-views'] ,function() {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src(['_prelease/**/*.js','_prelease/**/*.ejs','_prelease/**/*.css']) // Minify any CSS sources
        .pipe(revReplace({
            manifest: manifest
                // prefix: cdnConfig.Domain + pkg.name + '/'
        }))
        .pipe(gulp.dest('_prelease'))
});
