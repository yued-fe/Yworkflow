var path = require('path');

var gutil = require('gulp-util');
var through2 = require('through2');
var ast = require('cmd-util').ast;

module.exports = function (options) {
    options = options || {};

    return through2.obj(function (file, encoding, callback) {
        if (!file) {
            this.emit('error', new gutil.PluginError('gulp-lbf-transport', 'files can not be empty'));
            return callback();
        }

        if (file.isNull()) {
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-lbf-transport', 'streaming not supported'));
            return callback();
        }

        var contents = file.contents.toString('utf-8');
        var astModule;

        try {
            astModule = ast.parseFirst(contents); // { id: 'id', dependencies: ['a'], factory: factoryNode }
        } catch (ex) {
            this.emit('error', new gutil.PluginError('gulp-lbf-transport', 'parse file "' + gutil.colors.red(file.path) + '" failed'));
            return callback();
        }

        if (astModule && !astModule.id) { // 空文件 astModule = undefined
            astModule.id = path.join(options.publicPath, file.relative).replace(/\\/g, '/'); // 转换 "//" 兼容 windows
            contents = ast.modify(contents, astModule);
            file.contents = new Buffer(contents.print_to_string({ beautify: true }));
        }

        this.push(file);
        callback();
    });
}
