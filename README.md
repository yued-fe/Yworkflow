# 起点改造 前端构建服务工具

> 基于[Gulp(v4.0)](https://github.com/gulpjs/gulp/tree/4.0),配合起点Node服务框架的本地模板构建工具。

## 功能特性

- 自动化流程
	- Sass > CSS
	- JS压缩和eslint检查
	- CSS Sprite精灵图自动生成
	- [图片自动优化](https://www.npmjs.com/package/imagemin-pngquant)(压缩体积)
	- 去缓存文件Reversion(递增版本号)
	- 静态资源Combo

##快速开始

首先请根据你的系统安装[Node.js](https://nodejs.org/)环境。

* 下载安装
	1. `git clone http://git.code.oa.com/qidian_proj/Qidian.git` 或者svn checkout具体的项目仓库
	2. 进入项目文件夹目录，执行`npm install` ,若日志提示`permission denied` 权限的问题,请执行`sudo npm install`


##初始

请注意配置`.yconfig`文件，在这里可以配置项目对应的静态资源文件夹路径,本地调试所需的端口等。

##构建工具目录结构

````bash
QidianViewsTool/
│
├── gulp          		// Gulp 任务目录
│   ├── build.js      // gulp build
│   ├── clean.js    // gulp clean folder and files
│   ├── combo.js      	// gulp combo
│   ├── deploy.js      	// gulp zip
│   ├── images.js // gulp images
│   ├── javascript.js // gulp sprites
│   ├── sass.js    // gulp sass
│   ├── sprites.js  // gulp sprites (to modified)
│   │
│   │
│   ├── hash-tag-map
│   │   ├──rev-manifest.json // 静态资源hash映射表
│   │   └──rev-verionId.json //静态资源增量版本号映射表
│
├── package.json // 任务package.json
│
└── src         		  // 项目目录，详见下述项目结构 ↓↓↓
│   ├── json
│   ├── node-config
│   ├── static
│    └── views // gulp配置入口
│
├── .yconfig  // 构建工具基础配置
├── .csscombo.json // gulp-csscombo 配置文件
├── .eslintrc  // eslint 配置文件
├── .gitignore // git忽略文件
├── gulpfile.js // gulp任务流配置
├── index.js // 本地服务入口
├── package.json // 项目说明和依赖
├── README.md // 说明文档
````

#### 开发项目目录结构

````bash
src/                          // 项目目录
├── src                           // 源文件目录
│   ├── json                       // 模拟调试后台通信cgi和ajax接口目录
│   │ ├──ajax // 本地模拟ajax
│   │ └──page // 本地模拟cgi
│   │ ├── ajaxmap.js // ajax GET请求映射config
│   │ ├── ajaxpostmap.js ajax POST请求映射config
│   │
│   ├── node-config // **重要** Node框架机所依赖的config
│   │ ├── domain_alias.js // 设置域名别名,框架机会根据header hosts头处理映射逻辑
│   │ ├── dynamic_routermap.js   // Dynamic框架机路由映射config
│   │ ├── static_routermap.js  //  Static框架机API和生成html路径映射config
│   │ ├── local_dev_routermap.js // 本地调试动态和静态混合使用的路由config
│   │ ├── minify.js // 服务端渲染 html 压缩级别config
│   │ ├── server.js // 框架机环境、L5、资源路径等config
│
├── static                           // 静态资源开发路径， `gulp watch {.sass,.css.js}`会监听此目录下的文件
│   ├── qd  // 该目录资源对应线上 qidian.gtimg.com/qd/ 路径
│   │ ├── css // .sass 文件存放路径
│   │ ├── images // 静态图片资源存放路径
│   │ ├── js // 静态资源存放路径
│
├── views                          // 生产目录，具体的项目模板文件
 │   │  ├── rank.qidian.com
│   │ ├── free.qidian.com
│   │ ├── all.qidian.com
│   │ ├── index.html
├──  ├── list.html
````


## 任务说明

> 注1：**`./src`** 为源文件(开发目录)，`/build` 目录为流程**自动**生成的**临时目录**。
> 注2：**`./_prelease`**和**`_previews`**分别为发布之前**自动**生成的**静态资源目录**和**EJS模板目录**。
> 注3:**`_/tmp`**为本地模拟server路径的**临时目录**


**1. 初始化任务 `npm run init`**
	执行`npm init`，初始化项目，第一次会先编译和处理所有的静态资源文件，把`src`开发目录的相关资源经过编译和处理后生成到`build`目录，此时构建工具会在`:3234`端口开启一个本地服务，你可以通过`localhost:3234`访问配置路由的页面。

**2.生成不使用combo的模板文件`npm run nocombo-publish`**

执行`npm run nocombo-publish`，会依次执行

* `gulp clean`: 清理`./_prelease`,`./_previews`,`_/tmp`目录下的所有资源
* `gulp build`: sass转css，js检查和压缩，复制其他静态资源，在`build`目录生成本地调试使用的相关文件。
* `gulp rev` 将`build`目录下的所有静态资源，通过hash计算，增量生成版本号，在`hash-tag-map`目录下生成hash和版本号映射表。
* `gulp rev-fix` 将`.css`和`.js`文件中所有涉及相关静态资源的url路径均替换成版本号后的新url。
* `gulp rev-views` 将把`views`目录下的所有html模板中的静态资源替换成增加了版本号的新url

**3.生成使用combo的模板文件`npm run publish`**

在上述`nocombo-publish`之后，增加一步`gulp combo`的处理流程，自动将单独的css和js url变成一个combo url。

####预览

1.**普通开发和调试 `npm run dev`**
  开启本地服务，开启`gulp watch`，实时编译。模板文件使用的是`views`目录下的文件。

2.**预览`npm run preview`**

预览编译和版本化后的模板，模板文件使用的是`_previews`下的文件。

####待解决

1. 本地combo模拟（由于需要nginx支持，本地调试较为繁琐，此功能滞后）


####关于映射

框架机为了解决多环境、多业务支持，本次起点改造通过多域名的方式，隔离和区分环境机器，有诸如`devr.qidian.com`,`oar.qidian.com`,`rank.qidian.com`等多套域名，对应开发环境有`localr.qidian.com`。

若开发具体某个有二级频道的项目，请在`views`目录下以最终线上路由为基准新建项目文件夹，把相应的模板文件置于其中开发。

请在`src/node-config/domain_alias.js`中配置域名映射，以便正常启动本地服务。



####精灵图生成注意事项

本构建工具已经支持自动生成精灵高清@2x和标清@1x图

命令行输入`npm run sprite`即可。

注意

> 注1: 请将二倍的高清icon图标，根据项目需求，放在`src/static/images/{某个项目}/sprites/icon-*.png`下。


以起点某个`{projectA}`为例

```
├── static
│   ├── qd
│   │ ├── css
│   │ ├── images
│   │ │		├──projectA
│   │ │	    │      ├──icon-a.png
│   │ │	    │      ├──icon-b.png
│   │ │	    │      ├──icon-c.png
│   │ ├── js

```

开发者唯一只需关心的就是`icon`图标的目录。**不需要**自己手动配置精灵图`scss`文件。
工具会根据`{某个项目}`的名称，对应在`build/qd/images/{projectA}/`
生成`@2x.png`高清图与`@1x.png`标清图。并在`build/qd/css/projectA_sprite.scss`

```
├── build
│   ├── qd
│   │ ├── css
│   │ │		├── projectA_sprite.scss
│   │ ├── images
│   │ │		├──projectA
│   │ │	    │      ├── @2x.png
│   │ │	    │      ├── @1x.png
│   │ ├── js
```

若有多个项目`{projectB}`,`{projectC}`等等，工具均会自动对应生成，开发者只需要在引用精灵的scss文件中使用我们自定义好的宏就好。

```scss
$projectA-sprite-normal: '/qd/images/projectA/';
$projectA-sprite-retina: '../images/sprites/sprite@2x.png';


//使用精灵图

@include use-sprite($icon-a, $projectA-sprite-normal, $projectA-sprite-retina);

//按照上述方法，就可以直接调用某个精灵图了，无需手动调整background-size position等参数。

```
