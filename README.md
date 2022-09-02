
Yworkflow3 新手说明
==============

## 更新日志
* 2022.09.02 -- v3.1.18 修复高版本`npm`找不到`node_modules/gulp/bin/gulp`问题。兼容 高版本npm，下载npm包会打平目录结构
* 2020.09.25 -- v3.1.17 兼容 GQL
* 2019.02.19 -- v3.1.16 修复部分 BUGt s
* 2019.01.03 -- v3.1.15 补充 YUE 数据
* 2017.11.03 -- v3.1.12 新加inline task, 用法见下面
* 2017.11.02 -- v3.1.11 修复刷新问题，在tasks/plugins/gulp-changed-deps中加入nunjunks的include关键词
* 2017.08.21 -- v3.1.10 将mock中日志着色以及fix render报错
* 2017.08.18 -- v3.1.9 cli-tables模块遗漏补回
* 2017.08.18 -- v3.1.8 优化本地mock功能, 可以在js中利用req, res, next进行逻辑判断, 从而实现模拟错误,模拟延时等功能
* 2017.07.17 优化yworkflow cli功能,优化gulp模块调用,增加--build方法
* 2017.07.13 优化yworkflow cli日志,恢复日志彩色显示
* 2017.07.12 将runSequence任务变成串行,并行存在着任务执行冲突
* 2017.07.10 新增yworkflow，用于本地快速起yworkflow本地开发
* 2017.06.28 增加Css任务cssUrlToAbsolute开关,默认关闭
* 2017.06.25 增加build任务, 供yworkcli独立调用
* 2017.06.20 增加router任务:支持将路由文件夹合并成单一路由文件
* 2017.06.01 增加快速启动yworkflow的脚本,支持历史项目选择
* 2017.05.17 支持本地开发[json注释](https://github.com/yued-fe/Yworkflow#1json注释)
* 2017.05.16 路由配置params参数正则过滤:例`/:bookId(\\d+)`转`?bookId=$1`
* 2017.05.16 增加路由`.ejs`静态资源路由反向代理


## 写在前面

过去前端团队业务多以重构为主，传统静态页面开发的模式进行本地开发，好处是目录结构简单，容易理解，直接手写css和js，坏处也不言而喻，脱离了线上场景，无法掌握路由设计，无法正确管理页面的业务渲染逻辑，无法模拟ajax请求。

过去这一年来，我们的项目开发逐渐规范化和流程化，根据实际需求，结合前后端分离Node架构[Yuenode](https://github.com/yued-fe/yuenode)，开发出这一套基于`gulp`和`express`的本地脚手架工具。

利用NodeJs模拟服务器环境，在本地介入业务逻辑，把过去交给「开发」的套模板的工作，放到前端来做，提高前后端联调效率。

## 环境依赖

* [Node.js](https://nodejs.org/zh-cn/)
* [Graphics Magick](http://www.graphicsmagick.org/index.html)
* [Image Magick](https://www.imagemagick.org/script/index.php)

注意:由于国内网络问题,建议使用国内npm仓库源或者代理安装npm模块。推荐可以使用

* [淘宝NPM镜像](https://npm.taobao.org/)

Mac用户终结解决方案可以使用命令行代理[Shadowsocks](https://github.com/shadowsocks/shadowsocks/tree/master) + [proxychains4](https://github.com/rofl0r/proxychains-ng)，有效解决依赖下载速度问题。

## 终端推荐

* ~~Windows用户请使用`cmder`或者`git bash`等终端，原生的`CMD`太弱了缺失许多linux命令,可能会导致一些任务处理失败。~~(3.0版本不再对Windows进行支持，但是你依旧可以在windows下使用Yworkflow3.0进行本地开发，可能会遇到路径相关的问题，无法使用Yworkcli)。

* Mac用户推荐使用[iTerm2](https://www.iterm2.com/)，另外推荐配合使用[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)增强终端命令行功能。

由于精灵图生成、压缩需要调用系统图形模块[ImageMagick](http://www.imagemagick.org/script/index.php)和[ GraphicsMagick](http://www.graphicsmagick.org/)，请事先安装好相应的图像模块。

* GraphicsMagick:[下载地址](https://sourceforge.net/projects/graphicsmagick/files/graphicsmagick/1.3.25/)
* imagemagick: [下载地址](https://sourceforge.net/projects/graphicsmagick/files/graphicsmagick/1.3.25/)

**强烈建议**Mac用户使用[brew](http://brew.sh/)来安装

```
brew update && brew upgrade
brew install imagemagick
brew install graphicsmagick
```

## Yworkflow三件套

    * [Yworkflow](https://github.com/yued-fe/Yworkflow) :本地开发基础架构
    * [Yworkcli](https://github.com/yued-fe/yworkcli) :自动化静态资源版本化、模板combo工具
    * [Ymini](https://github.com/foru17/ymini) :压缩css和静态资源的脚本工具


## 功能特性

- 自动化构建
    - CSS
        - Sass编译
        - 资源相对路径转绝对路径
        - sourcemap
    - Javascript:
        - ESlint语法检测
        - require 补全提前声明
    - HTML
        - 默认ejs模板
        - nunjucks转ejs
    - 精灵图
        - svg转精灵图
    - 中文webfont
        - font-spider
    - 图像处理
       - [png图片优化](https://www.npmjs.com/package/imagemin-pngquant)

- 本地开发
    - 模拟框架机逻辑,浏览器直接HTTP模拟调试
    - 自定义业务路由
    - 服务自动监听文件变化:实时编译css和js

- 资源压缩
    - 参考[Ymini](https://github.com/foru17/ymini)说明文档


#### 开始任务


#### 安装

`npm install -g yworkflow Yworkcli del-cli`


#### 初始

Yworkflow3针对过去老版本必须紧跟项目文件夹、有过多强依赖，做了完全抽离。你可以安装Yworkflow3到你机器的任意位置，通过`yworkflow`的形式,启动任务。

项目的一切配置,均通过`.yconfig`文件配置，增加项目的定制化和适用性。

具体的配置,可以分别参考起点M站[qidian-m](http://git.code.oa.com/qidian_proj/qidian-m)和小说阅读网PC[readnovel_pc_proj](http://git.code.oa.com/readx/readnovel_pc_proj)


```

        var path = require('path');
        var rootCWD = '..';
        var defaultConfig = {
        'name': 'qidian-m',
        'author': 'luolei@yuewen.com',
        'gtimgname': 'qdm', // 对应 qidian.gtimg.com/{name} 路径
        'node_site': 'yworkflow', // 与后端约定的业务node别名
        'env': 'local',
        'master_host': 'm.qidian.com',// 设置主host,如果没有指定域名,则默认解析为该host,支持ip直接访问
        'debug': true,
        'proxy_force': true, // 开启代理开关,接口指向服务端数据
        'proxy_server': 'http://prem.qidian.com', // 接口服务地址
        'port': 8888,
        
        // 代理模式使用到的域名:下列所有域名在代理模式下均走Yworkflow router逻辑
        'hosts': [
            'm.qidian.com', // 配置该项目的业务域名,针对这里配置的所有域名进行路由代理
        ],
    
    // 由于实际业务上可能采用不同的域名,进行域名映射
    // 对于设置alias的域名统一转换成value
    'alias': {
        'mobile.qidian.com':'m.qidian.com'
    },
    
    // 目前所有业务都是同域反向代理,这里进行一个强约定
    // 可将所有的ajax路由在这里列出
    'ajax': [
        '/ajax', // 默认保留,请勿删除
        '/apiajax',
        '/meajax',
        '/majax'
    ],
    'graphql': ['/graphql'],
    //本地文件映射
    'paths': {
        'json': 'src/server/json', // 设置本地开发配置的 json路径
        'public_json': 'src/server/custom', // 注入公共数据 例如 data.user等
        'views': '.cache/views', // 设置本地ejs模板的读取路径
        'static_root': '.cache/static', // 指定开发时的资源入口
        'ejs_rewrite_router':'/ejs',// 针对旧有的 /ejs 反向代理做特殊处理指向 /qd 静态资源路由规则,默认路由为 /ejs
        // 'static':'src/static', // 静态资源路径可以直接指定一个通用路由
        'static': { // 也可以分别指派
            '/qdm': '.cache/qdm',
            '/lbf': 'http://devqidian.gtimg.com/lbf', // 支持直接将某一个域名代理到线上路径
            '/jssdk': '.cache/qd_jssdk',
            '/lbf': '.cache/lbf',
            '/qreport':'http://qdp.qidian.com/qreport' // 上报代理到线上资源
        } // 本地静态资源路径
    },
    
    // 提供自动上传到 ftp 服务功能
    'ftp': {
        'host': '192.168.1.1',
        'user': '',
        'password': ''
    },
    
    // server 配置相关是与框架机耦合的配置,这里请注意与运维约定相关参数
    'server': {
        'path': 'src/server/config', // 提供给框架机环境的配置入口路径
        'server_conf_file': 'server', // 框架机配置文件名,默认server.js
        'routermap_file': 'routes', // 动态路由配置文件
        'static_routemap_file': 'static_routermap', // 静态化路由配置文件
        'custome_handle_file': '', // 建议与 node_site 同名以便维护
        'extends_loader_file': 'extends/loader', // 自定义中间件入口
    },
    'root': {
        'cwd': '',
        'src': 'src',
        'dest': '.cache'
    },
    // 本地编译相关task
    'tasks': {
        // 支持将本地路由文件夹的路由打包成单一路由文件
        'router':{
            'srcEntry':'src/node-config/dynamic_routermap',// 本地路由文件夹入口
            'dest':'src/node-config/dynamic_routermap.js',// 最终生成的单一路由文件
            'exclude':['STATIC.js','PROXY.js']// 需要排除的本地路由
        },
        'html': {
            'src': 'src/server/views',
            'dest': '.cache/views',
            'prettify':true, // 格式化html代码
            'multiple': true,
            'nunjucks': {

            }
        },
        // 静态化路径
        'render': {
            'render_routermap_file': 'src/node-config/RENDER.js', // 该路由表设置的所有路由均会对应生成html实体文件
            'dest': '_html', // 静态化文件生成路径
            'minimize':true, // 生成压缩html 
        },
        // CSS编译相关
        'css': {
            'src': './src/static/css',
            'dest': './.cache/qdm/css',
            'cssUrlToAbsolute':false,// css中相对路径转绝对路径,默认关闭
            'autoprefix': true, //  autoprefix开关
            'sourcemap': './.map', // sourcemap开关
            'extensions': ['css', 'scss']
        },
        // JS编译相关
        'js': {
            'src': './src/static/js',
            'dest': '.cache/qdm/js',
            'sourcemap': './map',
            'eslint': {
                ignorePath: path.resolve(__filename,'../', '.eslintignore'), // gulp-eslint 忽略配置，路径与 gulpfile.js 文件位置有关联
            },
            'lbfTransport': { // 自动补齐模块ID和依赖
                publicPath: 'qdm/js',
            },
            'eslintFormatter': path.join('node_modules/eslint-friendly-formatter'), // gulp-eslint 格式化配置，路径与 gulpfile.js 文件位置有关
        },
        'img': {
            'src': './src/static/img',
            'dest': './.cache/qdm/img',
            'optimize': './src/static/images/events', // 优化图片处理
            'extensions': ['jpg', 'png', 'svg', 'gif', 'ico'], // 处理文件后缀
        },
        // ICON相关任务配置
        // 会自动遍历 src设置文件夹的目录,生成精灵图
        'icon': { 
            'src': './src/static/icon',
            'dest': './.cache/qdm/icon',
            'multiple': true, // 是否分批处理，即以子目录为单位，在多页面需要分开处理时会用到
            'img': { // 图片合并相关配置
                '1xDir': '.1x', // 1倍图存放地址，以 "." 开头是隐藏文件，为了表示此文件是生成的，不是源文件
                'imageResize': { // gulp-image-resize(将2倍图源文件压缩成1倍图) 插件配置
                    'width': '50%',
                    'upscale': true,
                },
                'spritesmith': { // gulp.spritesmith(生成雪碧图) 插件配置
                    'imgName': 'sprite.png',
                    'cssName': 'sprite.css',
                    'padding': 4,
                    'retinaSrcFilter': '!' + path.resolve(__filename,'../', '**/.1x/*'), // 2倍图过滤条件，路径与 gulpfile.js 文件位置有关联
                    'retinaImgName': 'sprite@2x.png',
                },
            },
            'svg': { // SVG合并相关配置
                'svgmin': { // gulp－svgmin(压缩svg) 插件配置
                    'plugins': [
                        { 'removeAttrs': { 'attrs': '(fill|fill-rule)' } },
                        { 'removeTitle': true },
                    ],
                },
                'svgstore': { 'inlineSvg': true }, // gulp-svgstore(合并svg) 插件配置
                'svgTransport': {}, // gulp-svg-transport(svg转js) 插件配置
                'rename': 'sprite.js', // gulp-rename(重命名合并后svg转js文件名字) 插件配置
            },
        },
        // 配置自动生成中文字体得入口页面
        'font': {
            'src': './src/static/font',
            'dest': './.cache/qdm/font',
            'extensions': ['css', 'eot', 'svg', 'ttf', 'woff', 'woff2'], // 处理文件后缀
            'fontSpider': {}, // gulp-font-spider(压缩字体) 插件配置
        },
        // 其他静态资源
        'static': {
            'src': './src/static',
            'dest': './.cache',
            'extensions': ['css', 'scss'],
            'copyDirect': { 
                // 直接复制资源到指定位置
                './src/server/views/*.*': './.cache/views',
            }
        }
    }
    };
    module.exports = defaultConfig;
````

#### 使用

1. 进入 {Yworkflow3路径}项目跟路径，例:`cd /Users/yuewen-luolei/Yuewen/Tencent/Yworkflow3`
2. 执行启动脚本 ` yworkflow --path {file}.ycofnig`
3. 打开浏览器，即可通过`.yconfig`中配置的域名和端口号，进行开发

#### 代理模式

线上业务是无port的概念,为方便本地调试，Yworkflow3支持代理模式。以Chrome浏览器为例。

1.安装[Proxy SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif)插件。
2.设置情景模式，端口号为具体项目端口号即可

![](https://luoleiorg.b0.upaiyun.com/tmp/proxy1.jpg)

3.浏览器切换到自定义的情景模式,这个时候就可以通过80端口访问本地页面，模拟线上环境。（此时接口依旧根据配置读取本地json或者测试服务器)

**注意**:

1. 不支持https代理,场景有限,滞后支持。
2. 如果在代理模式通过IP访问，默认理解host为`.yconfig`文件中配置的`master_host`。
3. 仅代理`hosts`中配置的域名,其他域名，均指向原始资源URL。

例:

小阅的配置如下

```
    'master_host': 'www.readnovel.com',
    'proxy_force': true, // 是否开启强制代理
    'proxy_server': 'http://oawww.readnovel.com', // 接口服务地址
    'port': 8008,
    'hosts': [
        'www.readnovel.com'
    ],
```

0. 非代理模式下,小阅访问`localwww.readnovel.com:8008`即可访问页面。
1. 代理模式下,小阅访问`localwww.readnovel.com`,`www.readnovel.com`，`10.97.180.114`(局域网或者公网IP)均可访问页面
2. 代理模式下,小阅访问资源`http://qidian.qpic.cn/qdbimg/349573/c_5334091103442901/90`,访问的是依旧原始资源

#### 发布

静态资源版本化和自动生成模板统一使用[Yworkcli](https://github.com/yued-fe/yworkcli)工具，该工具解决静态资源和模板映射的自动化生成。

1.安装`npm install -g Yworkcli del-cli`
2.配置文件

```javascript
{
    "static":{
        "path":".cahce/qdm", //生成的项目资源路径
        "gtimgName":"qdm", //对应的gtimg地址资源路径
        "output":"_prelease/qdm" //本地输出的编译后路径
    },
    "views":{
        "path":"src/views", //匹配的模板文件路径
        "output":"_previews/views"//最终生成的目录文件路劲
    },
    "configs":{
        "path":"src/node-config",//框架机config路径
        "output":"_previews/node-config"//框架集config发布路径
    },
    "combo": {
        "force": true,//是否开启combo
        "gtimgTag":"<%= staticConf.domains.static %>",// 静态资源环境配置
        "gtimgNamePrepend":"qd", // 在combo组合前增加文件名
        "uri":"<%= staticConf.domains.static %>/c/=",//combo的线上URL接口
        "logicCondition": "envType == \"pro\" || envType == \"oa\"" //开启combo的条件,注意需要转义双引号
    },
}

```

3.发布,进入项目路径`cd /Users/yuewen-luolei/Yuewen/Tencent/qidian-m && yworkcli --publish --log './ywork.log'`
4.可以通过 `--loag {相对路径}`来配置日志路径,可以查看`ywork.log`查看任务情况

#### 资源压缩

1. 安装 `npm install ymini -g`
2. 压缩JS资源 `ymini --js --path {PATH || FILENAME} #压缩指定文件夹下的所有'.js'文件`
3. 压缩CSS资源: `ymini --css --path {PATH || FILENAME} #压缩指定文件夹下的所有'.css'文件`


## 备注

#### **1.JSON注释**

![](https://luoleiorg.b0.upaiyun.com/tmp/json-strip.jpg)

支持在本地json文件中注释。

#### **2.JS mock**
除了在mock文件夹加入json数据之外, 支持加入js的mock文件. 并且js具有更高的优先级(即同目录下有a.js和a.json, a.js具有更高的优先级).

a.js:
```javascript
if(req.url === 'aaaaaa') {
    setTimeout(function () {
        next(null, {
            code: 0,
            data: {}
        });
    }, 1000);
} else {
    var err = new Error();
    err.code = 500;
    // 抛出500 error
    next(err);
}
```
#### **3. inline task**
因为inline css 或 js 到html的时候,需要替换一些地址,这个配置在replace里面.
```json
"inline": {
    "baseDir": "./.cache", //本地生成的文件夹
    "replace": [{
        "src": "need-to-replace-css-file-path",
        "dest": "need-to-export-css-file-dir",
        "patterns": {
            "/ovserseam/": "......" //文件中需要被替换的内容
        }
    }],
    "htmlPath": "path-to-need-inline-css-html-file",
    "htmlDest": "need-to-export-html-file-dir"
}
```



