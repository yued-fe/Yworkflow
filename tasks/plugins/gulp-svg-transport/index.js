var gutil = require('gulp-util');
var through2 = require('through2');

module.exports = function (options) {
    options = options || {};

    function wrap(str) {
        return '!(function() { document.body.insertAdjacentHTML(\'afterBegin\', \'<div hidden>' + str + '</div>\'); })();'
    }

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

        file.contents = new Buffer(wrap(file.contents.toString('utf-8')));
        this.push(file);
        callback();
    });
}
