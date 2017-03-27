/**
 * 服务器目录配置
 * views:服务所需的模板文件夹路径
 *
 */

var domainMap = {
    'apps' : 'apps.qidian.com'
};

var serverConfig = {
    "local": {
        cgi: { //后端动态服务相关配置
            "ip": "10.247.135.236",
            "domain": "devi.qidian.com",
            "L5": {
                "enable": false,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 524288
                }
            }
        },
        "views":{
            "path":"/Volumes/Macintosh HD/Users/yuewen-luolei/Yuewen/Shenzhen-SVN/qidian_proj/trunk/v2/src/views"
        },
        "index": {
            "path": "/Users/yuewen-luolei/Desktop/testfolder"
        },
		"static":{	//静态文件配置
            "domainPrefix" : "local",
			"staticDomain": "qidian.gtimg.com",
			"staticPath":"//local.qidian.com:2324/apps",
			"lbf": {
				"conf": {
					"paths": {
						"site": "//local.qidian.com:2324/apps/js",
                        "apps":"//local.qidian.com:2324/apps"
					},
					"vars": {
						"theme": "//local.qidian.com:2324/apps/css"
					},
					"combo": false,
					"debug": true
				}
			}
		}
    },
    "dev": {
        cgi: { //后端动态服务相关配置
            "ip": "10.247.135.236",
            "domain": "devapps.qidian.com",
            "L5": {
                "enable": false,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 524288
                }
            }
        },
        "views": { //模板路径
            "path": "/data/website/apps.qidian.com/views"
        },
        "index": {
            "path": "/data/website/static"
        },
        "static": { //静态文件配置
            "domainPrefix" : "dev",
            "staticDomain": "devqidian.gtimg.com",
            "staticPath": "//devqidian.gtimg.com/apps",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//devqidian.gtimg.com/apps/js",
                        "apps":"//devqidian.gtimg.com/apps"
                    },
                    "vars": {
                        "theme": "//devqidian.gtimg.com/apps/css"
                    },
                    "combo": false,
                    "debug": true
                }
            }
        }
    },
    "oa": {
        cgi: {
            "ip": "10.247.135.237",
            "domain": "oaapps.qidian.com",
            "L5": {
                "enable": true,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 1310720
                }
            }
        },
        "views": {
            "path": "/data/website/apps.qidian.com/views"
        },
        "index": {
            "path": "/data/website/static"
        },
        "static": {
            "domainPrefix" : "oa",
            "staticDomain": "oaqidian.gtimg.com",
            "staticPath": "//oaqidian.gtimg.com/apps",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//oaqidian.gtimg.com/apps/js",
                        "apps":"//oaqidian.gtimg.com/apps"
                    },
                    "vars": {
                        "theme": "//oaqidian.gtimg.com/apps/css"
                    },
                    "combo": true,
                    "debug": false
                }
            }
        }
    },
    "pro": {
        cgi: {
            "ip": "10.247.135.236",
            "domain": "apps.qidian.com",
            "L5": {
                "enable": true,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 1376256
                }
            }
        },
        "views": {
            "path": "/data/website/apps.qidian.com/views"
        },
        "index": {
            "path": "/data/website/static"
        },
        "static": {
            "domainPrefix" : "",
            "staticDomain": "qidian.gtimg.com",
            "staticPath": "//qidian.gtimg.com/apps",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//qidian.gtimg.com/apps/js",
                        "apps":"//qidian.gtimg.com/apps"
                    },
                    "vars": {
                        "theme": "//qidian.gtimg.com/apps/css"
                    },
                    "combo": true,
                    "debug": false
                }
            }
        }
    }
};


var genConf = function() {
    for(var env in serverConfig) {
        var domain = {};
        for(var k in domainMap) {
            if(env != 'pro') {
                domain[k] = env + domainMap[k];
            }
            else {
                domain[k] = domainMap[k];
            }
        }

        serverConfig[env]['domain'] = domain;
    }
    return serverConfig;
};

module.exports.domainMap = domainMap;
module.exports.genConf = genConf();
