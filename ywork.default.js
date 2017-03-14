/**
 * yworkflow基础配置示例
 * Author:luolei
 */
var path = require('path');

var rootCWD = '..';
var defaultConfig = {
	'name': 'yworkflow-demo',
	'author': 'luolei@yuewen.com',
	'gtimgname': 'en', // 对应 qidian.gtimg.com/{name} 路径
	'node_site': 'yworkflow', // 与后端约定的业务node别名
	'env': 'local',
	'master_host':'en.qidian.com',
	'debug': true,
	'proxy_force': true, // 是否开启强制代理
	'proxy_server':'https://devwww.webnovel.com', // 接口服务地址
	'port': 8008,
	//本地文件映射
	'paths':{
		'json':'src/json', // 设置本地开发配置的 json路径
		'public_json':'src/public',// 注入公共数据 例如 data.user等
		'views':'src/views', // 设置本地ejs模板的读取路径
		// 'static':'src/static', // 静态资源路径可以直接指定一个通用路由
		'static':{ // 也可以分别指派
			'/qdm':'https://qidian.gtimg.com/qdm',
			'/lbf':'https://qidian.gtimg.com/lbf',
			'/jssdk':'build/jssdk',
			'/en':'dist/en'
		} // 本地静态资源路径
	},
	// 提供自动上传到 ftp 服务功能
	'ftp': {
		'host': '10.97.19.100',
		'user': 'ftp',
		'password': 'lny4yjtwr3xhxlldoxltzom'
	},
	// server 配置相关是与框架机耦合的配置,这里请注意与运维约定相关参数
	'server': {
		'path': 'src/node-config', // 提供给框架机环境的配置入口路径
		'server_conf_file': 'server', // 框架机配置文件名,默认server.js
		'routermap_file': 'dynamic_routermap', // 动态路由配置文件
		'static_routemap_file': 'static_routermap', // 静态化路由配置文件
		'custome_handle_file': '', // 建议与 node_site 同名以便维护
		'extends_loader_file':'extends/loader',// 自定义中间件入口
	},

	'root': {
		'cwd': '',
		'src': 'src',
		'dest': 'build'
	},
	// 与本地开发
	'tasks': {
		// CSS编译相关
		'css': {
			'src': './src/static/en/css',
			'dist': './dist/en/css',
			'autoprefix': true, //  autoprefix开关
			'sourcemap': './.map', // sourcemap开关
			'extensions': ['css', 'scss']
		},
		'js': {
			'src': './src/static/en/js',
			'dist': './dist/en/js',
			'sourcemap':'./map',
			'eslint': {
				ignorePath: path.resolve(rootCWD, '.eslintignore'), // gulp-eslint 忽略配置，路径与 gulpfile.js 文件位置有关联
			},
			'lbfTransport': { // 自动补齐模块ID和依赖
				publicPath: 'en/js',
			},
			'eslintFormatter': path.join(rootCWD, 'node_modules/eslint-friendly-formatter'), // gulp-eslint 格式化配置，路径与 gulpfile.js 文件位置有关联
		},
		'img':{
			'src':'./src/static/en/images',
			'dist':'./dist/en/images',
			'optimize':'./src/static/en/images/events', // 优化图片处理
			'extensions':['jpg', 'png', 'svg', 'gif', 'ico'], // 处理文件后缀
		},
		'sprites':{

		}
	}

};


module.exports = defaultConfig;