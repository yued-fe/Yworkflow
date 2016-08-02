/**
 * 拓展方法加载器入口
 * Author:罗磊
 */


var fs = require('fs');

require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/\.js$/) !== null && file !== 'loader.js') {
        var name = file.replace('.js', '');
        exports[name] = require('./' + file);
    }
});
