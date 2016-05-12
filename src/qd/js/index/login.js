/**
 * @fileOverview
 * @author yangye & rainszhang
 * Created: 16-03-14
 */
LBF.define('/qd/js/index/login.js', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Cookie = require('util.Cookie');

    var body = $('body');
    var popop = [
        '<div id="login-popup" class="popup-wrap login-popup">',
        '<a class="close-popup" href="javascript:"></a>',
        '<div class="popup-box">',
        '<iframe frameborder=0 src="http://login.qidian.com/Login.php?appId=10&areaId=1&popup=1&target=iframe&style=2&pm=2&returnURL=http%3A%2F%2Favd.qidian.com%2FOALoginjump.aspx%3Fqd_skip%3D1%26ReturnUrl%3Dhttp%253A%252F%252Fdevi.qidian.com" name="frameLG" id="frameLG"></iframe>',
        '</div>',
        '</div>'
    ].join('');

    var btnOpenPopup = $('#login-btn, #pin-login');

    // 点击登录按钮 - 临时调用老站登录框的方法，迭代修改登录框时再优化
    btnOpenPopup.click(function () {

        showLoginPopup();
        var btnClosePopup = $('.close-popup');
        // 点击弹窗关闭按钮
        btnClosePopup.click(function () {
            hideLoginPopup();
        });
    });
    //显示登陆弹窗
    function showLoginPopup(){
        body.append('<div class="mask"></div>');
        body.append(popop);
        var mask = $('.mask');
        var docWidth = $(document).width();
        var docHeight = $(document).height();
        mask.css({'width': docWidth, 'height': docHeight});
        var popup = $('#login-popup');
        popup.show();
    };
    function hideLoginPopup(){
        var popup = $('#login-popup');
        var mask = $('.mask');
        popup.remove();
        mask.remove();
    };

    /**
     * 登录成功回调函数 - 沿用起点老站里的代码
     * @method callBack
     */
    window.QiDian_OA_Login = {};
    QiDian_OA_Login.callBack = function () {
        Login.init();
    };

    var Login = {
        /**
         * 登录成功后回调
         * @method init
         */
        init: function () {
            var mask = $('.mask');
            var popup = $('#login-popup');

            // 关闭弹窗与遮罩层
            popup.remove();
            mask.remove();

            if (Cookie.get('cmfuToken')) {
                // 登录态未超时，或，初次登录成功拉取用户信息
                this.getUserMsg();
            } else if (Cookie.get('mdltk')) {
                // 弱登录态（如：登录超时）时拉取用户信息
                this.weekLoginStatus();
            }
            // 退出登录
            this.logout();
        },

        /**
         * 未登录状态，登录成功拉取用户信息
         * @method getUserMsg
         */
        getUserMsg: function () {
            $.ajax({
                url: '/ajax/UserInfo/GetUserInfo',
                //允许请求头带加密信息
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                if (data.code === 0) {
                    $('#msg-box').show();
                    $('.sign-in').removeClass('hidden');
                    $('.sign-out').addClass('hidden');
                    $('#user-name, #nav-user-name').text(data.data.nickName);
                    if (data.data.msgCnt == 0) {
                        $('#msg-btn').find('i').addClass('black');
                    }
                    $('#msg-btn').find('i').text(data.data.msgCnt);
                    $('#top-msg').text(data.data.msgCnt);
                    if (data.data.bsCnt == 0) {
                        $('#shelf-num, #pin-shelf').hide();
                    } else {
                        $('#shelf-num, #pin-shelf').show().text(data.data.bsCnt);
                    }

                    // 产品暂把头像逻辑去除了
                    // $('#min-photo').attr('src', 'http://me.qidian.com/Images/UserImages/100x100/' + data.data.headImg + '.jpg');
                }
            });
        },

        /**
         * 弱登录态时拉取用户信息
         * @method weekLoginStatus
         */
        weekLoginStatus: function () {
            $('#msg-box').hide();
            var loginInfo = {};
            var userInfo = '';
            var cookieRaw = document.cookie.split(';');
            for (i = 0; i < cookieRaw.length; i++) {
                var cur = cookieRaw[i].split('=');
                var keyName = cur[0].replace(/ /g, "");
                loginInfo[keyName] = cur[1];
                if (keyName == 'mdltk') {
                    userInfo = cur.join('=');
                }
            }
            var _userName = decodeURIComponent(userInfo.split('&')[1].split('=').pop());
            var bookShelf = parseInt(Cookie.get('bsc'));

            $('.sign-in').removeClass('hidden');
            $('.sign-out').addClass('hidden');
            $('#user-name, #nav-user-name').text(_userName);
            if (!Cookie.get('bsc')) {
                $('#shelf-num, #pin-shelf').hide();
            } else {
                $('#shelf-num, #pin-shelf').show().text(bookShelf);
            }
            // 产品暂把头像逻辑去除了
            // var _userPhoto = userInfo.split('&')[5].split('=').pop();
            // $('#min-photo').attr('src', 'http://me.qidian.com/Images/UserImages/100x100/' + _userPhoto + '.jpg');
            // location.reload();
        },

        /**
         * 退出登录
         * @method logout
         */
        logout: function () {
            var that = this;
            $('#exit-btn, #exit').click(function () {
                that.requestSso('//s.if.qdmm.com/sso.aspx', 'user=0&otype=-1', function () {
                    Cookie.del('cmfuToken');
                    Cookie.del('mdltk');
                    $('.sign-in').addClass('hidden');
                    $('.sign-out').removeClass('hidden');
                    $('#shelf-num, #pin-shelf').hide().text('');
                    $('#web-dropdown').find('.not-logged').show().end().find('.logged-in').hide();
                });
            });
        },

        /**
         * 请求登出页面 起点老站复制过来的方法，大致是向后端服务器发送一次登出的请求
         * @method requestSso
         * @param url
         * @param arg
         * @param callBack
         */
        requestSso: function (url, arg, callBack) {
            if (arg == 'undefined' || arg == null || arg == '') {
                return;
            }

            var domscript = document.createElement("script");

            domscript.src = url + '?' + arg;
            domscript.type = "text/javascript";
            domscript.id = 'sso' + Math.random();
            domscript.onloadDone = false;
            domscript.onload = function () {
                domscript.onloadDone = true;
                if (callBack) try {
                    callBack()
                } catch (e) {
                }
            };
            domscript.onreadystatechange = function () {
                if (('loaded' === domscript.readyState || 'complete' === domscript.readyState) && !domscript.onloadDone) {
                    if (callBack) try {
                        callBack()
                    } catch (e) {
                    }
                    domscript.onloadDone = true;
                }
            };
            document.getElementsByTagName('head')[0].appendChild(domscript);
        }
    };

    Login.init();
    return {
        showLoginPopup:showLoginPopup,
        hideLoginPopup:hideLoginPopup,
        getUserMsg:Login.getUserMsg,
        weekLoginStatus:Login.weekLoginStatus,
        logout:Login.logout,
        requestSso:Login.requestSso
    }
});
