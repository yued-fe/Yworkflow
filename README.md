# 起点改造 前端构建服务工具

> 基于[Gulp(v4.0)](https://github.com/gulpjs/gulp/tree/4.0),配合起点Node服务框架的本地模板构建工具。

## 功能特性


#### *务必注意

######1) 修改`server.js`配置

原先的`src/node-config/server.js`中请修改最后

```
//Old
module.exports = genConf();
```
为下面的新代码

```
//New

module.exports.domainMap = domainMap;
module.exports.genConf = genConf();

```

#######2) 增加`extends/loader.js`拓展功能入口

请增加`src/node-config/loader.js`文件夹和文件。


```

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


```
