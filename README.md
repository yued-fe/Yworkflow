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

请增加`src/node-config/extends/loader.js`文件夹和文件。


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


####发布到内网ftp服务

Yworkflow支持页面静态化,会默认将`local_dev_routermap.js`中配置的所有路径遍历，依造路由文件夹曾经，在`_html`文件夹生成纯静态`.html`文件。

> 下面以点娘活动页面举个例子

可以在**临时**在`src/node-config/server.js`中增加一个`build`变量（静态的你入库不入库都随意，反正动态框架机你也用不到，动态的你就上了也没什么问题，看你心情，建议删掉，毕竟静态化内网展示只是临时演示用）。

直接命令行执行`npm run online-view`就可以发布到内网ftp服务器。

访问`http://10.97.19.100/project/activity.qidian.com/2016/dianniang`你就能看到页面了。


```

 "build": {
        "views":{
            "path":""
        },
        "index": {
            "path": ""
        },
        "static":{  //静态文件配置
            "domainPrefix" : "local",
            "staticDomain": "http://10.97.19.100",
            "staticPath":"http://10.97.19.100/activity/2016",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "http://10.97.19.100/activity/2016/dianniang/js"
                    },
                    "vars": {
                        "theme": "http://10.97.19.100/activity/2016/diangniang/css"
                    },
                    "combo": false,
                    "debug": true
                }
            }
        }
    },

```
