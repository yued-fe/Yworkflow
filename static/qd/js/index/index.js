/**
 * @fileOverview
 * @author rainszhang & yangye
 * Created: 15-11-14
 */
LBF.define('site.index.index', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ComboBox = require('ui.widget.ComboBox.ComboBox'),
        Switchable = require('ui.widget.Switchable.Switchable'),
        Cookie = require('util.Cookie'),
        ajaxSetting = require('site.component.ajaxSetting'),
        report = require('site.component.report'),
        Header = require('site.component.header'),
        BrowserSupport = require('site.component.browserSupport'),
        PinNav = require('site.component.pinNav'),
        Login = require('site.index.login');

    exports = module.exports = Node.inherit({
        /**
         * Default UI proxy Element
         * @protected
         */
        el: 'body',

        /**
         * Default UI events
         * @property events
         * @type Object
         * @protected
         */
        events: {
            'click #load-more': 'moreRankList',
            'click #btn-filter-search': 'btnFilterSearch',
            'click #survey-btn': 'openSurvey',
            'click #close-survey': 'closeSurvey'
        },

        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
            'btnRankMore': '#btn-more',
            'rankListRow': '#rank-list-row'
        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function () {

            // 设置UI Node proxy对象，chainable method，勿删
            this.setElement(this.el);

            // 页面逻辑入口
            this.init();

            // 返回组件
            return this;
        },

        /**
         * 页面逻辑入口
         */
        init: function () {
            /* 图片延迟加载
             * 如果想提载入图片，可以使用 threshold 进行设置，
             * $("img.lazy").lazyload({ threshold :100});
             */
            require.async('../component/jquery.lazyload', function () {
                $("img.lazy").lazyload({threshold: 100});
            });

            // 首屏 - 焦点图模块处理
            this.initAdMod();

            // 首屏 - 公告模块处理
            this.initNoticeMod();

            //判断用户是否第一次访问页面，如果是，满意度默认展开
            this.survey();

            //首屏焦点图延迟加载
            this.loadFirstScreenImg();

            //编辑推荐5张轮播
            require.async('../component/carousel', function () {
                $('#carousel .la-ball-pulse').remove();
                $('#carousel .slides').show();
                $('#carousel').carousel({
                    hAlign: 'center',
                    hMargin: 0.6,
                    frontWidth: 93,
                    frontHeight: 124,
                    carouselWidth: 93,
                    carouselHeight: 124,
                    directionNav: true,
                    buttonNav: 'bullets',
                    autoplay: true,
                    autoplayInterval: 3000,
                    pauseOnHover: true,
                    shadow: true,
                    description: true,
                    descriptionContainer: '.description'
                });
            });

            // 最新更新模块
            this.initUpdateMod();

            // 热门作品、完本精品、新书推荐轮 - 3D轮播调用
            this.init3dSlide();

            // 页脚搜书模块 - 初始化高级搜索下拉UI组件
            this.initBookSearch();

            // 页脚限时免费
            this.initLimitFreeMod();

            //  随机显示广告
            this.renderBanners();

            //上报系统
            report.send();
        },
        /**
         * 首屏焦点图模块处理
         * @method initAdMod
         */
        initAdMod: function () {
            //首页焦点图
            new Switchable({
                selector: '#switchable-slides .nav a',
                classAdd: "active",
                animation: "translate",
                autoTime: 3000,
                duration: 300,
                hoverStop: true,
                onSwitch: function (target) {
                    //遍历所有的img，延迟加载
                    target.each(function () {
                        var img = $(this).find('img')[0];
                        if (img && !img.src) {
                            img.src = $(img).attr('data-src');
                        }
                    });
                }
            });
        },
        /**
         * 首屏焦点图延迟加载
         * @method loadFirstScreenImg
         */
        loadFirstScreenImg: function () {
            $(window).on('load.firstScreenImg', function () {
                $('#switchable-slides li').each(function () {
                    var img = $(this).find('img')[0];
                    if (img && !img.src) {
                        img.src = $(img).attr('data-src');
                    }
                });
            })
        },
        /**
         * 初始化首屏公告模块
         * @method initNoticeMod
         */
        initNoticeMod: function () {

            // 显示更多公告效果
            var noticeWrap = $('#notice');
            var moreLink = $('#more-notice');
            var triangle = moreLink.find('i');
            noticeWrap.hover(function () {
                triangle.stop().animate({top: '6px', right: '6px'});
            }, function () {
                triangle.stop().animate({top: '-18px', right: '-18px'});
            });
            moreLink.hover(function () {
                triangle.stop().animate({top: '18px', right: '18px'});
            }, function () {
                triangle.stop().animate({top: '6px', right: '6px'});
            });

            //小喇叭广告轮播
            new Switchable({
                selector: '#wordSlide li',
                autoTime: 3000,
                direction: "vertical",
                animation: "translate"
            });
        },

        /**
         * 排行榜展开更多
         * @method moreRankList
         */
        moreRankList: function () {
            var rankWrap = this.rankListRow;
            var btnRankMore = this.btnRankMore;

            if (btnRankMore.hasClass('up')) {
                btnRankMore.removeClass().prev().text('展开更多');
                rankWrap.animate({height: '420px'});
            } else {
                btnRankMore.addClass('up').prev().text('收起更多');
                rankWrap.animate({height: '577px'});
            }
        },
        /**
         * 热门作品、完本精品、新书推荐轮 - 3D轮播调用
         * @method init3dSlide
         */
        init3dSlide: function () {
            /**
             *  三张型3D轮播通用实例
             *  @method startSlide
             *  @param id: 容器id
             */
            function startSlide(id) {
                $('#' + id).roundabout({
                    shape: 'lazySusan',
                    tilt: 0,
                    bearing: 0.0,
                    autoplay: true,
                    autoplayDuration: 3000,
                    autoplayPauseOnHover: true,
                    responsive: true,
                    minScale: 0.7,
                    maxScale: 1,
                    margin: 1,
                    clickToFocusCallback: function () {
                        switchTab(id);
                    },
                    autoplayCallback: function () {
                        switchTab(id);
                    }
                });
            }

            /**
             *  轮播时切换对应的文字介绍-用于回调
             *  @method switchTab
             *  @param id: 容器id
             */
            function switchTab(id) {
                var current = $('#' + id).find('li.roundabout-in-focus'); //
                var textWrap = $('#' + id).parent().next().find('dd').hide();
                if (current.hasClass('book1')) {
                    $(textWrap).eq(0).show();
                }
                if (current.hasClass('book2')) {
                    $(textWrap).eq(1).show();
                }
                if (current.hasClass('book3')) {
                    $(textWrap).eq(2).show();
                }
            }

            /*
             *  热门作品、完本精品、新书推荐轮 - 3D轮播调用，startSlide(id);
             */
            require.async('../component/roundabout', function (id) {
                $('.roundabout').fadeIn();
                startSlide('left-slide-01');
                startSlide('left-slide-02');
                startSlide('left-slide-03');
                $('.la-ball-pulse').remove();
            });
        },

        /**
         * 页脚搜书模块 - 初始化高级搜索下拉UI组件
         * @method initBookSearch
         */
        initBookSearch: function () {
            this.filterClassify = new ComboBox({
                selector: $('#classify'),
                className: 'classify'
            });
            this.filterSerial = new ComboBox({
                selector: $('#serial')
            });
            this.filterCharge = new ComboBox({
                selector: $('#charge')
            });
            this.filterWords = new ComboBox({
                selector: $('#words'),
                className: 'words'
            });
            this.filterTags = new ComboBox({
                selector: $('#tags'),
                className: 'tags'
            });
        },

        /**
         * 最新更新模块
         * @method initUpdateMod
         */
        initUpdateMod: function () {
            var updateTab = $('#update-tab a');
            var updateList = $('#update-list');

            updateTab.on('click', function () {
                $(this).addClass('act').siblings().removeClass('act');
                updateList.find('.update-table').eq(updateTab.index(this)).show().siblings().hide();
            });
        },

        /**
         * 页脚搜书模块 - 执行条件找书
         * @methed btnFilterSearch
         * @param e 事件对象
         */
        btnFilterSearch: function (e) {
            var target = e.target;
            var filterClassify = this.filterClassify.val();
            var filterSerial = this.filterSerial.val();
            var filterCharge = this.filterCharge.val();
            var filterWords = this.filterWords.val();
            var filterTags = encodeURIComponent(this.filterTags.val());
            var url = '';

            url = '//all.qidian.com/Book/BookStore.aspx?&ChannelId=' + filterClassify + '&Action=' + filterSerial + '&Vip=' + filterCharge + '&Size=' + filterWords + '&Tag=' + filterTags;

            $(target).attr('href', url);

            // 执行跳转
            return true;
        },

        /**
         * 限时免费
         * @method initLimitFreeMod
         */
        initLimitFreeMod: function () {
            //需要重复执行的免费阅读禁用方法
            function disableFreeBtn() {
                //给免费阅读加上disabled样式
                $('.time-limit-wrap li a.blue-btn').addClass('disabled');
                //如果是disabled，点击无法跳转
                $('.time-limit-wrap li a.disabled').click(function () {
                    return false;
                });
            }
            //开始请求
            $.ajax({
                type: 'GET',
                url: '/ajax/Free/getSysTime',
                dataType: 'json',
                success: function (d) {
                    var _d = d;
                    //服务器系统时间
                    var sysTime = _d.data.sysTime;
                    //从html模板中获取结束时间
                    var end_time = $('#time-box').attr('data-endtime');

                    //按照结束时间开启计算，生成到html显示剩余时间
                    $(function () {
                        countDown(end_time, "#countdown .day", "#countdown .hour", "#countdown .minute", "#countdown .second");
                    });

                    //计算倒计时
                    function countDown(endTime, day_elem, hour_elem, minute_elem, second_elem) {
                        //剩余时间 = 结束时间 - 服务器系统时间
                        var remaining = (end_time - sysTime) / 1000;
                        console.log(remaining);
                        console.log(remaining <= 0);
                        var timer = setInterval(function () {
                            if (remaining > 0) {
                                remaining -= 1;
                                var day = Math.floor((remaining / 3600) / 24);
                                var hour = Math.floor((remaining / 3600) % 24);
                                var minute = Math.floor((remaining / 60) % 60);
                                var second = Math.floor(remaining % 60);
                                day_elem && $(day_elem).text(day);
                                $(hour_elem).text(hour < 10 ? "0" + hour : hour);
                                $(minute_elem).text(minute < 10 ? "0" + minute : minute);
                                $(second_elem).text(second < 10 ? "0" + second : second);
                                //在每次倒数时判断是否<=0，true时，实时把按钮禁用
                                if (remaining <= 0) {
                                    disableFreeBtn();
                                }
                            } else {
                                clearInterval(timer);
                            }
                            //首次刷新页面时判断是否剩余时间是否 <= 0，true时把按钮禁用
                            if (remaining <= 0) {
                                disableFreeBtn();
                            }
                        }, 1000);
                    }
                }
            });
        },

        /**
         * 各广告位随机显示的逻辑
         * @methed renderBanners
         */
        renderBanners: function () {
            //右侧公告下的广告
            //获取广告数据的长度
            var length_arb = g_data.adBanner.adRightBottom.length;
            if (length_arb != 1) {
                var random_arb = Math.floor(parseInt(Math.random() * length_arb));
                var adRightBottom = g_data.adBanner.adRightBottom[random_arb];
                var arbImgUrl_arb = adRightBottom.adImgUrl;
                var arbJumpUrl_arb = adRightBottom.adJumpUrl;
                $('#arb-banner').attr('href', arbJumpUrl_arb);
                $('#arb-banner img').attr('src', arbImgUrl_arb);
            }

            //第一个横屏广告
            var length_2 = g_data.adBanner.adBanner2.length;
            var random_2 = Math.floor(parseInt(Math.random() * length_2));
            var dataBanner2 = g_data.adBanner.adBanner2[random_2];
            var adImgUrl_2 = dataBanner2.adImgUrl;
            var adJumpUrl_2 = dataBanner2.adJumpUrl;
            $('#banner2 a').attr('href', adJumpUrl_2);
            $('#banner2 a img').attr('src', adImgUrl_2);

            //第二个横屏广告
            var length_3 = g_data.adBanner.adBanner3.length;
            var random_3 = Math.floor(parseInt(Math.random() * length_3));
            var dataBanner3 = g_data.adBanner.adBanner3[random_3];
            var adImgUrl_3 = dataBanner3.adImgUrl;
            var adJumpUrl_3 = dataBanner3.adJumpUrl;
            $('#banner3 a').attr('href', adJumpUrl_3);
            $('#banner3 a img').attr('src', adImgUrl_3);

            //第二个横屏广告
            var length_4 = g_data.adBanner.adBanner4.length;
            var random_4 = Math.floor(parseInt(Math.random() * length_4));
            var dataBanner4 = g_data.adBanner.adBanner4[random_4];
            var adImgUrl_4 = dataBanner4.adImgUrl;
            var adJumpUrl_4 = dataBanner4.adJumpUrl;
            $('#banner4 a').attr('href', adJumpUrl_4);
            $('#banner4 a img').attr('src', adImgUrl_4);
        },
        /**
         * 满意度交互
         * @param e 事件对象
         * @method openSurvey，closeSurvey
         */
        openSurvey: function (e) {
            var target = $(e.target);
            target.animate({left: "-30px"}, 'fast');
            $('#survey-wrap').animate({left: '0', width: '100%'}, 500);
        },
        closeSurvey: function () {
            $('#survey-wrap').animate({left: '-956px', width: '0'}, 500);
            $('#survey-btn').animate({left: "0"}, 'fast');
        },
        //判断用户是否首次登陆，是的话展开满意度并设置cookie——newVisit值为1 期限3天，下次访问默认收起
        survey: function () {
            if (!Cookie.get('newVisit')) {
                $('#survey-btn, #survey-wrap').addClass('first');
                Cookie.set('newVisit', '1', '', '', 2592000000);
            }
        }
    })
});