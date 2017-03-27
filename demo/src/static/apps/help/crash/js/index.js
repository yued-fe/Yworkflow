/**
 * @fileOverview
 * @author liuwentao
 * Created: 16/9/18
 */
LBF.define('apps/help/crash/js/index.js', function (require, exports, module) {

    var $ = require('lib.Zepto'),
        Node = require('ui.Nodes.Node');

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
            'click #down-link':'upgradeApp',
            'click #reply-fixed-btn':'bugReport'

        },

        /**
         * Nodes default UI element，this.
         * @property elements
         * @type Object
         * @protected
         */
        elements: {},



        /**
         * 调用app方法检查升级
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        upgradeApp:function(e){
            var target = $(e.currentTarget);
            qdsdk.app.upgrade();
        },

        /**
         * 调用Bug反馈
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        bugReport:function(e){
                    //上报
            qdsdk.app.report( 'qdH5_HF_06' , 1 );
            //跳转
            qdsdk.app.openBugFeedback();

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

            this.appLink();

        },

        /*
        * 更新app下载地址
        * */
        appLink : function () {

                //判断是否为最新版本
                qdsdk.app.isLatestVersion(function(res){
                    var result = res.result;
                    var  data = res.data;
                    // console.log(result,data);
                    //不为最新版本时
                    if( result == 0 && data.latestVersion == false ){

                        var upBox = $('.up-app');
                        upBox.show();

                        var qdLink = $('#down-link');

                        //如果是ios系统替换页面默认为安卓下载升级链接
                        if(qdsdk.isIOS){
                            qdLink.attr( 'href', 'https://itunes.apple.com/cn/app/id534174796?mt=8' );
                        }
                    }
                })
                //页面进入触发
                qdsdk.app.report('qdH5_P_Help and Feedback', 0);


        }

    });
})
