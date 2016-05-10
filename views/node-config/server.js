/**
 * 服务器目录配置
 * views:服务所需的模板文件夹路径
 *
 */

var domainMap = {
    'free'      : 'f.qidian.com',
    'rank'      : 'r.qidian.com',
    'search'    : 's.qidian.com',
    'all'       : 'a.qidian.com',
    'finish'    : 'fin.qidian.com',
    'www'       : 'i.qidian.com'
}

var serverConfig = {
    "local": {
        "views":{
            "path":"/Users/yuewen-luolei/Yuewen/Tencent/v2/views"
        },
        "index": {
            "path": "/Users/yuewen-luolei/Desktop/testfolder"
        },
		"static":{	//静态文件配置
            "domainPrefix" : "local",
			"staticDomain": "devqidian.gtimg.com",
			"staticPath":"//local.qidian.com:3234/qd",
			"lbf": {
				"conf": {
					"paths": {
						"site": "//local.qidian.com:3234/qd/js"
					},
					"vars": {
						"theme": "//local.qidian.com:3234/qd/css"
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
            "domain": "devi.qidian.com",
            "L5": {
                "enable": false,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 524288
                }
            }
        },
        "views": { //模板路径
            "path": "/data/website/qidian.com/views"
        },
        "index": {
            "path": "/data/website/static/www.qidian.com"
        },
        "static": { //静态文件配置
            "domainPrefix" : "dev",
            "staticDomain": "devqidian.gtimg.com",
            "staticPath": "//devqidian.gtimg.com/qd",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//devqidian.gtimg.com/qd/js"
                    },
                    "vars": {
                        "theme": "//devqidian.gtimg.com/qd/css"
                    },
                    "combo": true,
                    "debug": true
                }
            }
        }
    },
    "oa": {
        cgi: {
            "ip": "10.247.135.237",
            "domain": "oai.qidian.com",
            "L5": {
                "enable": false,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 524288
                }
            }
        },
        "views": {
            "path": "/data/website/qidian.com/views"
        },
        "index": {
            "path": "/data/website/static/www.qidian.com"
        },
        "static": {
            "domainPrefix" : "oa",
            "staticDomain": "oaqidian.gtimg.com",
            "staticPath": "//oaqidian.gtimg.com/qd",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//oaqidian.gtimg.com/qd/js"
                    },
                    "vars": {
                        "theme": "//oaqidian.gtimg.com/qd/css"
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
            "domain": "i.qidian.com",
            "L5": {
                "enable": true,
                "conf": {
                    "MODID": 64138113,
                    "CMDID": 524288
                }
            }
        },
        "views": {
            "path": "/data/website/qidian.com/views"
        },
        "index": {
            "path": "/data/website/static/www.qidian.com"
        },
        "static": {
            "domainPrefix" : "",
            "staticDomain": "qidian.gtimg.com",
            "staticPath": "//qidian.gtimg.com/qd",
            "lbf": {
                "conf": {
                    "paths": {
                        "site": "//qidian.gtimg.com/qd/js"
                    },
                    "vars": {
                        "theme": "//qidian.gtimg.com/qd/css"
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
}

module.exports = genConf();
