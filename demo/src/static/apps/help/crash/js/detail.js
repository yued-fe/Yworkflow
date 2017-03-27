/**
 * @fileOverview
 * @author liuwentao
 * Created: 16/9/18
 */
LBF.define('apps/help/crash/js/detail.js', function (require, exports, module) {

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
        events: {},

        /**reply-fixed-btn
         * Nodes default UI element，this.
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

            //已解决和未解决
            this.whetherSolve();

        },

        /*
        * 已解决和未解决
        * @method whetherSolve
        * */
        whetherSolve : function () {


                var solveBtn = $('#J_whetherSolve a'),
                    solveNoList = $('.whether-solve-not'),
                    solveNoListItem = solveNoList.find('a');

                //点击是否解决按钮
                solveBtn.on('click',function () {

                    var _this = $(this);

                    _this.addClass('cur');

                    if(_this.hasClass('no-solve-btn')){

                        solveNoList.show();

                    }
                    //上报
                    var eventId = _this.attr('data-rep');
                    qdsdk.app.report( eventId , 1 );

                    solveBtn.off('click');

                });

                //点击未解决的原因选项
                solveNoListItem.on('click',function () {
                    var _this = $(this);

                    //上报
                    var eventId = _this.attr('data-rep');
                    qdsdk.app.report( eventId , 1 );
                    _this.addClass('cur');
                    solveNoListItem.off('click');

                });




        }

    });
})
