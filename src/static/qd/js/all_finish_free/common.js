/**
 * Created by renjiale on 2016/4/22.
 */
/**
 * Created by renjiale on 2016/4/22.
 */
/**
 * @fileOverview
 * @author  renjiale
 * Created: 2016-4-11
 * Description:此JS包含左侧侧边栏的逻辑、切换图文列表模式的逻辑、按条件排序的逻辑,是全部作品页、完本频道页、免费作品页共同引用的js
 */
LBF.define('/qd/js/all_finish_free/common.js', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('/qd/js/component/ajaxSetting.js'),
        Checkbox = require('ui.Nodes.Checkbox'),
        report = require('/qd/js/component/report.js'),
        Header = require('/qd/js/component/header.js'),
        JSON = require('lang.JSON'),
        BrowserSupport = require('/qd/js/component/browserSupport.js'),
        Pagination = require('ui.Nodes.Pagination'),
        Login = require('/qd/js/index/login.js'),
        Cookie = require('util.Cookie');

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
            'click #free-type-tab li': 'freeTypeSwitch',
            'click #unfold': 'showTagMore',
            'click .type-filter dl dd': 'selectSubType',
            'click .work-filter li': 'selectCondition',
            'click .selected a': 'removeCondition',
            'click .tool-bar .select-wrap a': 'orderBy',
            'click #img-text': 'imgTextMode',
            'click #only-text': 'onlyTextMode',
            'click .go-sub-type': 'filterBySubType',
            'mouseenter #yiwen': 'showQuestionTip',
            'mouseleave #yiwen': 'closeQuestionTip'
        },
        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {},

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
            var that = this;
            //上报系统
            report.send();

            //LBF Checkbox 只看3月内新书
            this.onlyNewBook();
            //获取当前查询的所有条件的参数及其值，全局化
            this.params = JSON.parse(g_data.params);
            this.typeId = this.params.chanId;
            this.subTypeId = this.params.subCateId;
            this.actionId = this.params.action;
            this.vipId = this.params.vip;
            this.sizeId = this.params.size;
            this.signId = this.params.sign;
            this.tagName = this.params.tag;
            this.orderId = this.params.orderId;
            this.currentPage = parseInt($('#page-container').attr('data-page'));
            this.newIn3Month = this.params.month;
            this.showId = this.params.style;

            //初始化分页
            this.pagiNation();

            //勾选3个月内新书
            $('.get-new-book').on('check', function () {
                that.newIn3Month = 3;
                that.currentPage = 1;
                that.setUrl();
            });
            //取消勾选3个月内新书
            $('.get-new-book').on('uncheck', function () {
                that.newIn3Month = -1;
                that.currentPage = 1;
                that.setUrl();
            });

        },
        /**
         * 免费种类切换
         * @method freeTypeSwitch
         * @param e:事件对象
         */
        freeTypeSwitch: function (e) {
            var target = $(e.target);
            var pageType = parseInt(target.attr('type'));
            if (pageType == 1) {
                location.href = g_data.domain;
            } else {
                location.href = g_data.domain + '/all';
            }
        },
        /**
         * 展开更多标签
         * @method showTagMore
         * @param e 事件对象
         */
        showTagMore: function (e) {
            if (e.target.nodeName.toLowerCase() == 'span') {
                var target = $(e.target).parent().parent();
            } else if (e.target.nodeName.toLowerCase() == 'i') {
                var target = $(e.target).parent().parent().parent();
            } else if (e.target.nodeName.toLowerCase() == 'a') {
                var target = $(e.target).parent();
            } else {
                var target = $(e.target);
            }

            $('.work-filter.tag').find('li.hidden').removeClass();
            target.remove();
        },
        /**
         * 初始化只看3个月新书 checkbox
         */
        onlyNewBook: function () {
            var onlyCheckbox = new Checkbox({
                selector: '.get-new-book',
                events: {
                    click: function () {
                        //这里获取点击前的状态
                        this.get('value');
                    }
                }
            });
        },
        /**
         * 选择分类
         * @method selectType
         * @param e 事件对象
         */
        selectType: function (e) {
            //判断被点击节点类型
            if (e.target.nodeName.toLowerCase() == 'a') {
                var targetType = $(e.target).parent();
            } else {
                var targetType = $(e.target);
            }
            // var targetRow = targetType.parent();
            // var targetId = targetType.attr('id');
            // var subTypes = targetRow.next();
            this.typeId = parseInt(targetType.attr('data-id'));
            //查询此分类下的数据
            this.setUrl();
            //location.href = this.setUrl();
        },
        /**
         * 选择子分类
         * @method selectSubType
         * @param e 事件对象
         */
        selectSubType: function (e) {
            if (e.target.nodeName.toLowerCase() == 'a') {
                var targetSubType = $(e.target).parent();
            } else {
                var targetSubType = $(e.target);
            }
            // 全局初始化子分类
            this.subTypeId = parseInt(targetSubType.attr('data-subtype'));
            //将页面初始化为第一页
            this.currentPage = 1;
            //查询此子分类下的数据
            this.setUrl();
            //location.href = this.setUrl();
        },
        /**
         * 列表中二级分类的跳转
         * @method filterBySubType
         * @param e 事件对象
         */
        filterBySubType: function (e) {
            var target = $(e.target);
            this.typeId = parseInt(target.attr('data-typeid'));
            this.subTypeId = parseInt(target.attr('data-subtypeid'));
            this.currentPage = 1;
            this.setUrl();
            //location.href=this.setUrl();
        },
        /**
         * 拼url
         * @method combineUrl
         * @param router 当前页面对应的路由字符串
         * @param paramArr 所有参数及值的数组
         */
        combineUrl: function (router, paramArr) {
            var paramStr = '?';
            for (var i = 0; i < paramArr.length; i++) {
                paramStr = paramStr + paramArr[i].name + '=' + paramArr[i].val;
                if (i != (paramArr.length - 1)) {
                    paramStr = paramStr + '&'
                }
            }
            return router + paramStr;
        },

        /**
         * 准备参数及其值对应的数组，最终跳转到拼接好的url上
         * @method setUrl
         */
        setUrl: function () {
            var that = this;
            //请求参数存在数组中,如果分类切换了，子分类重置为-1
            var currentParam = [
                {
                    name: 'size',
                    val: that.sizeId
                },
                {
                    name: 'sign',
                    val: that.signId
                },
                {
                    name: 'tag',
                    val: decodeURI(that.tagName) == '全部' ? -1 : that.tagName
                },
                {
                    name: 'chanId',
                    val: that.typeId
                },
                {
                    name: 'subCateId',
                    val: (that.params.chanId == -1) || (that.typeId == that.params.chanId) ? that.subTypeId : -1
                },
                {
                    name: 'orderId',
                    val: that.orderId
                },
                {
                    name: 'page',
                    val: that.currentPage
                },
                {
                    name: 'month',
                    val: that.newIn3Month
                },
                {
                    name: 'style',
                    val: that.showId
                }
            ];

            //如果当前页面有'状态'筛选条件，则加入Url中
            if ($('.action-filter').length > 0) {
                currentParam.push({
                    name: 'action',
                    val: that.actionId
                });
            }
            //如果当前页面有'vip'筛选条件，则加入Url中
            if ($('.vip-filter').length > 0) {
                currentParam.push({
                    name: 'vip',
                    val: that.vipId
                });
            }
            //去往拼出的最终URL
            location.href = that.combineUrl(g_data.url, currentParam);
        },

        //setUrl:function(){
        //    var that = this;
        //    //请求参数存在数组中,如果分类切换了，子分类重置为-1
        //    var currentParam=[
        //        {
        //            name:'size',
        //            val:that.sizeId
        //        },
        //        {
        //            name:'sign',
        //            val:that.signId
        //        },
        //        {
        //            name:'tag',
        //            val:decodeURI(that.tagName)=='全部'?-1:that.tagName
        //        },
        //        {
        //            name:'chanId',
        //            val:that.typeId
        //        },
        //        {
        //            name:'subCateId',
        //            val:(that.params.chanId==-1) || (that.typeId==that.params.chanId)?that.subTypeId:-1
        //        },
        //        {
        //            name:'orderId',
        //            val:that.orderId
        //        },
        //        {
        //            name:'page',
        //            val:that.currentPage
        //        },
        //        {
        //            name:'month',
        //            val:that.newIn3Month
        //        },
        //        {
        //            name:'show',
        //            val:that.showId
        //        }
        //    ];
        //    //初始化未带参数的url
        //    var url = g_data.url+'?';
        //    var paramStr = '';
        //    //循环拼出参数和值的组合字符串
        //    for(var i=0;i<currentParam.length;i++){
        //        paramStr=paramStr+currentParam[i].name+'='+currentParam[i].val+'&';
        //    }
        //    //如果当前页面有'状态'筛选条件，则加入Url中
        //    if($('.action-filter').length>0){
        //        paramStr=paramStr+"action="+that.actionId+'&';
        //    }
        //    //如果当前页面有'vip'筛选条件，则加入Url中
        //    if($('.vip-filter').length>0){
        //        paramStr=paramStr+"vip="+that.vipId+'&';
        //    }
        //    //拼出最终请求的URL
        //    var finalUrl = url+paramStr.substring(0,paramStr.length-1);
        //    return finalUrl;
        //},

        /**
         * 设置筛选条件
         * @method selectCondition
         * @param e 事件对象
         */
        selectCondition: function (e) {
            var that = this;
            if (e.target.nodeName.toLowerCase() == 'a') {
                var target = $(e.target).parent();
            } else {
                var target = $(e.target);
            }
            //如果点击的是标签出'展开'标签，则不进行页面刷新
            if (e.target.nodeName.toLowerCase() == 'span' || e.target.nodeName.toLowerCase() == 'i' || target.hasClass('more')) {
                return;
            }
            var filterType = target.parent().attr('type');

            switch (filterType) {
                case 'category':
                    that.typeId = parseInt(target.attr('data-id'));
                    that.subTypeId = -1;
                    break;
                case 'size':
                    that.sizeId = parseInt(target.attr('data-id'));
                    break;
                case 'sign':
                    that.signId = parseInt(target.attr('data-id'));
                    break;
                case 'tag':
                    that.tagName = encodeURIComponent(target.find('a').html());
                    break;
                case 'vip':
                    that.vipId = parseInt(target.attr('data-id'));
                    break;
                case 'action':
                    that.actionId = parseInt(target.attr('data-id'));
                    break;
            }
            //每次重新筛选，页面都回到第一页
            that.currentPage = 1;
            //刷新页面
            that.setUrl();
            //location.href = this.setUrl();
        },
        removeCondition: function (e) {
            var that = this;
            if (e.target.nodeName.toLowerCase() == 'cite') {
                var targetToRemove = $(e.target).parent();
            } else {
                var targetToRemove = $(e.target);
            }

            var filterType = targetToRemove.attr('type');
            //如果点击的是'全部'，则不予处理
            if (filterType == 'all') {
                return;
            }
            switch (filterType) {
                case 'category':
                    that.typeId = -1;
                    that.subTypeId = -1;
                    break;
                case 'subCategory':
                    that.subTypeId = -1;
                    that.typeId = -1;
                    break;
                case 'size':
                    that.sizeId = -1;
                    break;
                case 'sign':
                    that.signId = -1;
                    break;
                case 'tag':
                    that.tagName = -1;
                    break;
                case 'vip':
                    that.vipId = -1;
                    break;
                case 'action':
                    that.actionId = -1;
                    break;
            }
            //刷新页面
            that.setUrl();
            //location.href = this.setUrl();
        },
        /**
         * 根据不同规则排序
         * @method orderBy
         * @param e 事件对象
         */
        orderBy: function (e) {
            if (e.target.nodeName.toLowerCase() == 'cite') {
                var target = $(e.target).parent();
            } else {
                var target = $(e.target);
            }
            this.orderId = parseInt(target.attr('data-id'));
            this.currentPage = 1;
            //刷新页面
            this.setUrl();
            //location.href = this.setUrl();
        },
        /**
         * 切换到图文模式
         * @method imgTextMode
         */
        imgTextMode: function () {
            //刷新页面
            this.showId = 1;
            this.currentPage = 1;
            this.setUrl();
            //location.href = this.setUrl();
        },

        /**
         * 切换到列表模式
         * @method onlyTextMode
         */
        onlyTextMode: function () {
            //刷新页面
            this.showId = 2;
            this.currentPage = 1;
            this.setUrl();
            //location.href = this.setUrl();
        },
        /**
         * 分页
         * @method pagiNation
         */
        pagiNation: function () {
            var that = this;
            var maxPage = parseInt($('#page-container').attr('data-pageMax'));
            var pagination = new Pagination({
                container: '.pagination',
                startPage: 1,
                endPage: maxPage,
                page: parseInt(that.currentPage),
                isShowJump: true,
                headDisplay: 1,
                tailDisplay: 1,
                prevText: '&lt;',
                nextText: '&gt;',
                events: {
                    'change:page': function (e, page) {
                        that.currentPage = page;
                        that.setUrl();
                        //location.href=that.setUrl();
                    }
                }
            });
        },
        /**
         * 显示“由于政策和内容原因，部分作品暂时未能显示”的提示
         * @method showQuestionTip1
         */
        showQuestionTip: function () {
            $('#hover-tip').fadeIn(200);
        },
        /**
         * 隐藏“由于政策和内容原因，部分作品暂时未能显示”的提示
         * @method closeQuestionTip
         */
        closeQuestionTip: function () {
            $('#hover-tip').stop().fadeOut(200);
        }
    })
});
