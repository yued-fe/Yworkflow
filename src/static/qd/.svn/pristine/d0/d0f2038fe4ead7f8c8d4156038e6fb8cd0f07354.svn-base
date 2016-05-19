/**
 * Created by renjiale on 2016/4/22.
 */
/**
 * @fileOverview
 * @author  renjiale
 * Created: 2016-4-11
 */
LBF.define('site.free.addBook_0_1', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('site.component.ajaxSetting'),
        Checkbox = require('ui.Nodes.Checkbox'),
        //report = require('site.component.report'),
        Header = require('site.component.header_0_1'),
        BrowserSupport = require('site.component.browserSupport'),
        Pagination = require('ui.Nodes.Pagination'),
        Login = require('site.index.login'),
        Cookie = require('util.Cookie'),
        LightTip = require('ui.widget.LightTip.LightTip');

    function addToBookShelf(e,oldClassName,newClassName){
        //如果书已在书架中，则不需要加入书架
        var targetBook =  $(e.target);
        if(targetBook.hasClass(newClassName)){
            return;
        }
        //如果是未登录状态，则弹出登录弹窗
        if(!Cookie.get('cmfuToken')){
            Login.showLoginPopup();
        }else{
            //已登录状态下，点击加入书架则直接向后端发送请求
            var bookId = targetBook.attr('data-bookId');
            $.ajax({
                type:'GET',
                url:'/ajax/BookShelf/add',
                dataType: 'json',
                data:{
                    bookId:bookId
                },
                success:function(data){
                    if(data.code === 0){
                        targetBook.removeClass(oldClassName);
                        targetBook.addClass(newClassName);
                        targetBook.html('已在书架');
                        new LightTip({
                            content: '<div class="simple-tips"><span class="iconfont success">&#xe61d;</span>成功加入书架</div>'
                        }).success();
                    }else{
                        switch(parseInt(data.code)){
                            case 1000:
                                Login.showLoginPopup();
                                break;
                            case 1002:
                                new LightTip({
                                    content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span>已经在书架中</div>'
                                }).error();
                                targetBook.removeClass(oldClassName);
                                targetBook.addClass(newClassName);
                                targetBook.html('已在书架');
                                break;
                            case 1003:
                                new LightTip({
                                    content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span>书架已满</div>'
                                }).error();
                                break;
                            case 1004:
                                new LightTip({
                                    content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span>加入失败</div>'
                                }).error();
                                break;
                        }
                    }
                }
            })
        }
    }
    /**
     * 关闭登录弹窗
     * @method hideLoginPopup
     */
    $('body').on('click','.close-popup',function(){
        Login.hideLoginPopup();
    });

    return {
        addToBookShelf:addToBookShelf
    }

});