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


##注意

Windows用户请使用`cmber`或者`git bash`等终端，原声的`CMD`太弱了缺失许多linux命令,可能会导致一些任务处理失败。


##初始

请注意配置`.yconfig`文件，在这里可以配置项目对应的静态资源文件夹路径,本地调试所需的端口等。

##构建工具目录结构




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
│   │ │	    │      ├──sprite
│   │ │	    │      │     ├── @2x.png
│   │ │	    │      │     ├── @1x.png
│   │ ├── js
```

若有多个项目`{projectB}`,`{projectC}`等等，工具均会自动对应生成，开发者只需要在引用精灵的scss文件中使用我们自定义好的宏就好。

```scss
$projectA-sprite-normal: '/qd/images/projectA/sprite/@1x.png';
$projectA-sprite-retina: '/qd/images/projectA/sprite/@2x.png';


//使用精灵图

@include use-sprite($icon-a, $projectA-sprite-normal, $projectA-sprite-retina);

//按照上述方法，就可以直接调用某个精灵图了，无需手动调整background-size position等参数。

```
