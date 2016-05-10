/**
 * @fileOverview
 * @author yangye
 * Created: 16-04-07
 */
LBF.define('site.component.header', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Autocomplete = require('ui.widget.Autocomplete.Autocomplete'),
        Cookie = require('util.Cookie');

    var report = {};
    var envType = g_data.envType;
    var pageId = g_data.pageId;

    /**
     * 返回旧版，设置cookie ns值=1后跳回旧版网站，期限3天
     * @mothed backOldSite
     */
    $('#back-old').on('click', function () {
        Cookie.set('ns', 1, 'qidian.com', '', 259200000);
        return true;
    });

    /**
     * 除首页以外，hover到作品分类时显示作品分类下拉菜单
     * @method dropTypeList
     * 绑定了作品分类li.first 和 classify-list自身事件
     */
    function dropTypeList() {
        var timer, timer2 = null;
        //移入作品分类时触发显示列表事件，用户快速划过鼠标时不触发
        $('#type-hover .first').mouseover(function () {
            //鼠标停留200毫秒才会赋值触发事件
            timer = setTimeout(function () {
                $('#classify-list').slideDown(300);
            }, 100);
            clearTimeout(timer2);
        });
        //hover到列表时仍然保持显示
        $('#type-hover #classify-list').mouseover(function () {
            clearTimeout(timer2);
            $('#classify-list').show();
        });
        //移开作品分类和列表时，列表隐藏
        $('#type-hover .first, #type-hover #classify-list').mouseout(function () {
            clearTimeout(timer);
            timer2 = setTimeout(function () {
                $('#classify-list').slideUp(200);
            }, 100)
        });
    }

    dropTypeList();

    /**
     * 进入页面后判断是否跳回老站
     * @mothed isJumpOld
     */
    var IsJumpOld = {
        init: function () {
            //检测是否跳回旧版
            this.isJumpOld();
        },
        /**
         * 判断用户cookie如果不是2就跳回老站
         * @method isJumpOld
         */
        isJumpOld: function () {
            /*if (Cookie.get('ns') != 2) {
             location.href = 'http://www.qidian.com';
             }*/
        }
    };
    IsJumpOld.init();

    /**
     * 初始化首屏搜书模块
     * @method initAutocompleteMod
     */
    var AutoComplete = {
        init: function () {
            // 首屏 - 搜书自动补全逻辑
            this.initAutocompleteMod();
        },

        initAutocompleteMod: function () {
            new Autocomplete({
                selector: '#s-box',
                lookup: $('#s-box').val(),
                serviceUrl: '/ajax/Search/AutoComplete',
                groupBy: "category",
                type: 'GET',
                minChars: 0,
                onSearchComplete: (function (query, data, resultContainer) {
                    if (data && data.length != 0) {
                        if (g_data.domainSearch == location.hostname) {
                            $(resultContainer).find('.lbf-autocomplete-suggestion').each(function (i) {
                                $(this).wrapInner('<a href="' +'//'+ g_data.domainSearch + '/?kw='+encodeURIComponent(data[i].value)+ '"'+ '"data-aid="qd_A13"></a>');
                            });
                        }else{
                            $(resultContainer).find('.lbf-autocomplete-suggestion').each(function (i) {
                                $(this).wrapInner('<a target="_blank" href="' +'//'+ g_data.domainSearch + '/?kw='+encodeURIComponent(data[i].value)+ '"'+ '"data-aid="qd_A13"></a>');
                            });
                        }

                    } else {
                        // 无结果隐藏
                        $('#s-box').click();
                    }
                }),
                onSelect: (function () {
                    // Autocomplete好像有bug，选择后再次focus结果会自动隐藏
                    $('#s-box').click();
                })
            });

            /**
             * 点击搜索跳转到搜书页
             * @method searchJump
             * @param btn:点击搜索的按钮对象 word:搜索框的input对象
             */
            function searchJump(btn, word) {
                btn.on('click', function () {
                    //判断值是否是空，是空去取placeholder值后带着值传给搜索页
                    if (word.val() == '') {
                        word.val(word.attr('placeholder'))
                    }
                    var searchVal = word.val();
                    //判断域名是否是搜索页，是的话当前页面搜索，否则跳转带值跳搜索页
                    if (g_data.domainSearch == location.hostname) {
                        location.href ='//'+ g_data.domainSearch + '?kw=' + encodeURIComponent(searchVal);
                    } else {
                        // 事件触发超链接的方案，window.open是千万不能用的！
                        var url = '//'+ g_data.domainSearch + '?kw=' + encodeURIComponent(searchVal);
                        var el = document.createElement("a");
                        document.body.appendChild(el);
                        el.href = url;
                        el.target = '_blank';
                        el.click();
                        document.body.removeChild(el);
                    }
                });
            }

            searchJump($('#search-btn'), $('#s-box'));  //头部搜索跳转

            // 支持enter键搜索
            $('#s-box').on('keydown', function (evt) {
                if (evt.keyCode == 13) {
                    //判断值是否是空，是空去取placeholder值后带着值传给搜索页
                    if ($(this).val() == '') {
                        $(this).val($(this).attr('placeholder'))
                    }
                    //判断域名是否是搜索页，是的话当前页面搜索，否则跳转带值跳搜索页
                    if (g_data.domainSearch == location.hostname) {
                        location.href ='//'+ g_data.domainSearch + '?kw=' + encodeURIComponent($('#s-box').val());
                    } else {
                        // 事件触发超链接的方案，window.open是千万不能用的！
                        var url ='//'+ g_data.domainSearch + '?kw=' + encodeURIComponent($('#s-box').val());
                        var el = document.createElement("a");
                        document.body.appendChild(el);
                        el.href = url;
                        el.target = '_blank';
                        el.click();
                        document.body.removeChild(el);
                    }
                }
            });
        }
    };
    AutoComplete.init();

    /**
     * 页游手游下拉菜单展示
     * @method gameListDropDown
     */
    var gameListDropDown = {
        init: function () {
            // 导航右侧 页游手游下拉菜单
            this.gameDropDown();

            //判断是否登录，显示页游最近玩过的页游数据
            this.latelyWebGameData();
        },
        /**
         * 导航条 页游、手游鼠标移入移出延时下拉菜单
         * @method gameDropDown
         */
        gameDropDown: function () {
            var webGame = $('#game-web');
            var phoneGame = $('#game-phone');
            var webDropDown = $('#web-dropdown');
            var phoneDropDown = $('#phone-dropdown');
            //设置页游 手游 鼠标移入移出的定时器，延迟事件。
            var webTime, webTime2, phoneTime, phoneTime2 = null;
            //页游下拉
            webGame.mouseover(function () {
                //鼠标停留100毫秒后才触发显示
                webTime = setTimeout(function () {
                    webDropDown.slideDown(300);
                }, 100);
                clearTimeout(webTime2);
            });
            webDropDown.mouseover(function () {
                webDropDown.show();
            });
            webGame.mouseout(function () {
                //鼠标离开100毫秒后才触发显示，为了防止从菜单移入下拉菜单短暂缝隙时菜单会被隐藏，增强体验，不闪动
                webTime2 = setTimeout(function () {
                    webDropDown.slideUp(200);
                }, 100);
                clearTimeout(webTime);
            });
            //手游下拉
            phoneGame.mouseover(function () {
                //鼠标停留100毫秒后才触发显示
                phoneTime = setTimeout(function () {
                    phoneDropDown.slideDown(300);
                }, 100);
                clearTimeout(phoneTime2);
            });
            phoneDropDown.mouseover(function () {
                phoneDropDown.show();
            });
            phoneGame.mouseout(function () {
                //鼠标离开100毫秒后才触发显示，为了防止从菜单移入下拉菜单短暂缝隙时菜单会被隐藏，增强体验，不闪动
                phoneTime2 = setTimeout(function () {
                    phoneDropDown.slideUp(200);
                }, 100);
                clearTimeout(phoneTime);
            });
        },
        latelyWebGameData: function () {
            //登录态未超时，或初次登录成功后显示最近玩过的下拉框，隐藏未登录的下拉框
            if (Cookie.get('cmfuToken')) {
                var webGameBox = $('#web-dropdown');
                webGameBox.find('.not-logged').hide().end().find('.logged-in').show();
                $.ajax({
                    url: "/ajax/PortalOps/GetRecord",
                    //允许请求头带加密信息
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function (data) {
                    if (data.code === 0) {
                        var latelyList = $('#lately');
                        //获取游戏名、所在区、游戏链接
                        var gameName_1 = data.data.record[0].name;
                        var gameName_2 = data.data.record[1].name;
                        var jumpUrl_1 = data.data.record[0].jumpUrl;
                        var jumpUrl_2 = data.data.record[1].jumpUrl;
                        var area_1 = data.data.record[0].area;
                        var area_2 = data.data.record[1].area;

                        //查找第一个页游DOM元素
                        var game1 = latelyList.find('dd').eq(0);
                        var game_1 = game1.find('.name');
                        var gameLink_1 = game1.find('.link');
                        var gameArea_1 = game1.find('strong');

                        //填入第一个游戏信息
                        game_1.text(gameName_1);
                        gameArea_1.text(area_1);
                        game_1.attr('href', jumpUrl_1);
                        gameLink_1.attr('href', jumpUrl_1);

                        //查找第二个页游DOM元素
                        var game2 = latelyList.find('dd').eq(1);
                        var game_2 = game2.find('.name');
                        var gameLink_2 = game2.find('.link');
                        var gameArea_2 = game2.find('strong');

                        //填入第二个游戏信息
                        game_2.text(gameName_2);
                        gameArea_2.text(area_2);
                        game_2.attr('href', jumpUrl_2);
                        gameLink_2.attr('href', jumpUrl_2);
                    }
                });
            }
        }
    };
    gameListDropDown.init();
});
