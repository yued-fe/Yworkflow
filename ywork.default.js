/**
 * yworkflow基础配置示例
 * Author:luolei
 */
var path = require('path');

var rootCWD = '..';
var defaultConfig = {
    'name': 'qidian-m',
    'author': 'luolei@yuewen.com',
    'gtimgName': 'qdm', // 对应 qidian.gtimg.com/{name} 路径
    'node_site': 'yworkflow', // 与后端约定的业务node别名
    'env': 'local',
    'master_host': 'm.qidian.com',
    'debug': true,
    'proxy_force': true, // 是否开启强制代理
    'proxy_server': 'http://prem.qidian.com', // 接口服务地址
    'port': 8888,
    // 执行sudo npm run hosts --path {项目路径} 可以自动注入host到 /etc/hosts 文件夹
    'hosts': [
        'localm.qidian.com',
    ],
    // 由于实际业务上可能采用不同的域名,进行域名映射
    // 对于设置alias的域名统一转换成value
    'alias': {
        'mobile.qidian.com':'m.qidian.com'
    },
    // 目前所有业务都是同域反向代理,这里进行一个强约定
    // 可将下列所有匹配路由的ajax请求代理到 proxy_server
    'ajax': [
        '/ajax', // 默认保留,请勿删除
        '/apiajax',
        '/meajax',
        '/majax'
    ],
    //本地文件映射
    'paths': {
        'json': 'src/server/json', // 设置本地开发配置的 json路径
        'public_json': 'src/public', // 注入公共数据 例如 data.user等
        'views': '.cache/views', // 设置本地ejs模板的读取路径
        'static_root': '.cache/static', // 指定开发时的资源入口
        // 'static':'src/static', // 静态资源路径可以直接指定一个通用路由
        'static': { // 也可以分别指定
            '/qdm': '.cache/qdm',
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
    // 与本地开发
    'tasks': { // 若用不到相应的任务,直接注释掉相关配置即可
        // 'html': {
        //     'src': 'src/server/views',
        //     'dest': '.cache/views',
        //     'multiple': true,
        //     'nunjucks': {

        //     }
        // },
        // CSS编译相关
        'css': {
            'src': './src/static/css',
            'dest': './.cache/qdm/css',
            'autoprefix': true, //  autoprefix开关
            'sourcemap': './.map', // sourcemap开关
            'extensions': ['css', 'scss']
        },
        'js': {
            'src': './src/static/js',
            'dest': '.cache/qdm/js',
            'sourcemap': './map',
            'eslint': {
                ignorePath: path.resolve(rootCWD, '.eslintignore'), // gulp-eslint 忽略配置，路径与 gulpfile.js 文件位置有关联
            },
            'lbfTransport': { // 自动补齐模块ID和依赖
                publicPath: 'qdm/js',
            },
             'eslintFormatter': path.join(rootCWD, 'node_modules/eslint-friendly-formatter'), // gulp-eslint 格式化配置，路径与 gulpfile.js 文件位置有关联
        },
        // 'img': {
        //     'src': './src/static/img',
        //     'dest': './.cache/qdm/img',
        //     'optimize': './src/static/images/events', // 优化图片处理
        //     'extensions': ['jpg', 'png', 'svg', 'gif', 'ico'], // 处理文件后缀
        // },
        // 'icon': { // ICON相关任务配置
        //     'src': './src/static/icon',
        //     'dest': './.cache/qdm/icon',
        //     'multiple': true, // 是否分批处理，即以子目录为单位，在多页面需要分开处理时会用到
        //     'img': { // 图片合并相关配置
        //         '1xDir': '.1x', // 1倍图存放地址，以 "." 开头是隐藏文件，为了表示此文件是生成的，不是源文件
        //         'imageResize': { // gulp-image-resize(将2倍图源文件压缩成1倍图) 插件配置
        //             'width': '50%',
        //             'upscale': true,
        //         },
        //         'spritesmith': { // gulp.spritesmith(生成雪碧图) 插件配置
        //             'imgName': 'sprite.png',
        //             'cssName': 'sprite.css',
        //             'padding': 4,
        //             'retinaSrcFilter': '!' + path.join(rootCWD, '**/.1x/*'), // 2倍图过滤条件，路径与 gulpfile.js 文件位置有关联
        //             'retinaImgName': 'sprite@2x.png',
        //         },
        //     },
        //     'svg': { // SVG合并相关配置
        //         'svgmin': { // gulp－svgmin(压缩svg) 插件配置
        //             'plugins': [
        //                 { 'removeAttrs': { 'attrs': '(fill|fill-rule)' } },
        //                 { 'removeTitle': true },
        //             ],
        //         },
        //         'svgstore': { 'inlineSvg': true }, // gulp-svgstore(合并svg) 插件配置
        //         'svgTransport': {}, // gulp-svg-transport(svg转js) 插件配置
        //         'rename': 'sprite.js', // gulp-rename(重命名合并后svg转js文件名字) 插件配置
        //     },
        // },
        // // 配置自动生成中文字体得入口页面
        // 'font': {
        //     'src': './src/static/font',
        //     'dest': './.cache/qdm/font',
        //     'extensions': ['css', 'eot', 'svg', 'ttf', 'woff', 'woff2'], // 处理文件后缀
        //     'fontSpider': {}, // gulp-font-spider(压缩字体) 插件配置
        // },
        // 其他静态资源
        'static': {
            'src': './src/static',
            'dest': './.cache',
            'extensions': ['css', 'scss'],
            'copyDirect': {
                './src/static/lbf/**': './.cache/lbf',
                './src/static/qd_jssdk/**': './.cache/qd_jssdk',
                './src/server/config/**': './.cache/config',
                './src/server/views/*.*': './.cache/views',
            }
        }
    }

};


module.exports = defaultConfig;
