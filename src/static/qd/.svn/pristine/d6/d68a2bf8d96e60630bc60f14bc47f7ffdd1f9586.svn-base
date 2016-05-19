(function ($) {
    var CarouselEvo = function (element, options) {
        var settings = $.extend({}, $.fn.carousel.defaults, options), self = this, element = $(element), carousel = element.children('.slides');
        carousel.children('div').addClass('slideItem');
        var slideItems = carousel.children('.slideItem'), slideImage = slideItems.find('img'), currentSlide = 0, targetSlide = 0, numberSlides = slideItems.length, isAnimationRunning = false, pause = true;
        this.current = currentSlide;
        this.length = numberSlides;
        this.init = function () {
            var o = settings;
            initSlides();
            if (o.directionNav == true) {
                initDirectionButton();
            }
            if (o.buttonNav != 'none') {
                initButtonNav();
            }
            if (o.reflection == true) {
                initReflection();
            }
            if (o.shadow == true) {
                initShadow();
            }
            if (o.description == true) {
                initDesc();
            }
            if (o.autoplay == true) {
                runAutoplay();
            }
            initVideo();
        };
        var setImageSize = function (p) {
            var o = settings, n = numberSlides, w = o.frontWidth, h = o.frontHeight, ret;
            if (p != 0) {
                if (o.hAlign == 'center') {
                    if (p > 0 && p <= Math.ceil((n - 1) / 2)) {
                        var front = setImageSize(p - 1);
                        w = o.backZoom * front.width;
                        h = o.backZoom * front.height;
                    }
                    else {
                        var sz = setImageSize(n - p);
                        w = sz.width;
                        h = sz.height;
                    }
                }
                else {
                    if (p == (n - 1)) {
                        w = o.frontWidth / o.backZoom;
                        h = o.frontHeight / o.backZoom;
                    }
                    else {
                        var front = setImageSize(p - 1);
                        w = o.backZoom * front.width;
                        h = o.backZoom * front.height;
                    }
                }
            }
            return ret = {width: w, height: h};
        };
        var setSlideSize = function (p) {
            var o = settings, n = numberSlides, w = o.frontWidth, h = o.frontHeight + reflectionHeight(p) + shadowHeight(p), ret;
            if (p != 0) {
                if (o.hAlign == 'center') {
                    if (p > 0 && p <= Math.ceil((n - 1) / 2)) {
                        var front = setImageSize(p - 1);
                        w = o.backZoom * front.width;
                        h = (o.backZoom * front.height) + reflectionHeight(p) + shadowHeight(p);
                    }
                    else {
                        var sz = setSlideSize(n - p);
                        w = sz.width;
                        h = sz.height;
                    }
                }
                else {
                    if (p == (n - 1)) {
                        w = o.frontWidth / o.backZoom;
                        h = (o.frontHeight / o.backZoom) + reflectionHeight(p) + shadowHeight(p);
                    }
                    else {
                        var front = setImageSize(p - 1);
                        w = o.backZoom * front.width;
                        h = (o.backZoom * front.height) + reflectionHeight(p) + shadowHeight(p);
                    }
                }
            }
            return ret = {width: w, height: h};
        };
        var getMargin = function (p) {
            var o = settings, vm, hm, ret, iz = setImageSize(p);
            vm = iz.height * o.vMargin;
            hm = iz.width * o.hMargin;
            return ret = {vMargin: vm, hMargin: hm};
        };
        var centerPos = function (p) {
            var o = settings, c = topPos(p - 1) + (setImageSize(p - 1).height - setImageSize(p).height) / 2;
            if (o.hAlign != 'center') {
                if (p == (numberSlides - 1)) {
                    c = o.top - ((setImageSize(p).height - setImageSize(0).height) / 2);
                }
            }
            return c;
        };
        var topPos = function (p) {
            var o = settings, t = o.top, vm = getMargin(p).vMargin;
            if (o.vAlign == 'bottom') {
                t = o.bottom;
            }
            if (p != 0) {
                if (o.hAlign == 'center') {
                    if (p > 0 && p <= Math.ceil((numberSlides - 1) / 2)) {
                        if (o.vAlign == 'center') {
                            t = centerPos(p);
                        }
                        else {
                            t = centerPos(p) + vm;
                        }
                    }
                    else {
                        t = topPos(numberSlides - p);
                    }
                }
                else {
                    if (p == (numberSlides - 1)) {
                        if (o.vAlign == 'center') {
                            t = centerPos(p);
                        }
                        else {
                            t = centerPos(p) - vm;
                        }
                    }
                    else {
                        if (o.vAlign == 'center') {
                            t = centerPos(p);
                        }
                        else {
                            t = centerPos(p) + vm;
                        }
                    }
                }
            }
            return t;
        };
        var horizonPos = function (p) {
            var o = settings, n = numberSlides, hPos, mod = n % 2, endSlide = n / 2, hm = getMargin(p).hMargin;
            if (p == 0) {
                if (o.hAlign == 'center') {
                    hPos = (o.carouselWidth - o.frontWidth) / 2;
                }
                else {
                    hPos = o.left;
                    if (o.hAlign == 'right') {
                        hPos = o.right;
                    }
                }
            }
            else {
                if (o.hAlign == 'center') {
                    if (p > 0 && p <= Math.ceil((n - 1) / 2)) {
                        hPos = horizonPos(p - 1) - hm;
                        if (mod == 0) {
                            if (p == endSlide) {
                                hPos = (o.carouselWidth - setSlideSize(p).width) / 2;
                            }
                        }
                    }
                    else {
                        hPos = o.carouselWidth - horizonPos(n - p) - setSlideSize(p).width;
                    }
                }
                else {
                    if (p == (n - 1)) {
                        hPos = horizonPos(0) - (setSlideSize(p).width - setSlideSize(0).width) / 2 - hm;
                    }
                    else {
                        hPos = horizonPos(p - 1) + (setSlideSize(p - 1).width - setSlideSize(p).width) / 2 + hm;
                    }
                }
            }
            return hPos;
        };
        var setOpacity = function (p) {
            var o = settings, n = numberSlides, opc = 1, hiddenSlide = n - o.slidesPerScroll;
            if (hiddenSlide < 2) {
                hiddenSlide = 2;
            }
            if (o.hAlign == 'center') {
                var s1 = (n - 1) / 2, hs2 = hiddenSlide / 2, lastSlide1 = (s1 + 1) - hs2, lastSlide2 = s1 + hs2;
                if (p == 0) {
                    opc = 1;
                }
                else {
                    opc = o.backOpacity;
                    if (p >= lastSlide1 && p <= lastSlide2) {
                        opc = 0;
                    }
                }
            }
            else {
                if (p == 0) {
                    opc = 1;
                }
                else {
                    opc = o.backOpacity;
                    if (!(p < (n - hiddenSlide))) {
                        opc = 0;
                    }
                }
            }
            return opc;
        };
        var setSlidePosition = function (p) {
            var pos = new Array(), o = settings, n = numberSlides;
            for (var i = 0; i < n; i++) {
                var sz = setSlideSize(i);
                if (o.hAlign == 'left') {
                    pos[i] = {
                        width: sz.width,
                        height: sz.height,
                        top: topPos(i),
                        left: horizonPos(i),
                        opacity: setOpacity(i)
                    };
                    if (o.vAlign == 'bottom') {
                        pos[i] = {
                            width: sz.width,
                            height: sz.height,
                            bottom: topPos(i),
                            left: horizonPos(i),
                            opacity: setOpacity(i)
                        };
                    }
                }
                else {
                    pos[i] = {
                        width: sz.width,
                        height: sz.height,
                        top: topPos(i),
                        right: horizonPos(i),
                        opacity: setOpacity(i)
                    };
                    if (o.vAlign == 'bottom') {
                        pos[i] = {
                            width: sz.width,
                            height: sz.height,
                            bottom: topPos(i),
                            right: horizonPos(i),
                            opacity: setOpacity(i)
                        };
                    }
                }
            }
            return pos[p];
        };
        var slidePos = function (i) {
            var cs = currentSlide, pos = i - cs;
            if (i < cs) {
                pos += numberSlides;
            }
            return pos;
        };
        var zIndex = function (i) {
            var z, n = numberSlides, hAlign = settings.hAlign;
            if (hAlign == 'left' || hAlign == 'right') {
                if (i == (n - 1)) {
                    z = n - 1;
                }
                else {
                    z = n - (2 + i);
                }
            }
            else {
                if (i >= 0 && i <= ((n - 1) / 2)) {
                    z = (n - 1) - i;
                }
                else {
                    z = i - 1;
                }
            }
            return z;
        };
        var slidesMouseOver = function (event) {
            var o = settings;
            if (o.autoplay == true && o.pauseOnHover == true) {
                stopAutoplay();
            }
        };
        var slidesMouseOut = function (event) {
            var o = settings;
            if (o.autoplay == true && o.pauseOnHover == true) {
                if (pause == true) {
                    runAutoplay();
                }
            }
        };
        var initSlides = function () {
            var o = settings, n = numberSlides, images = slideImage;
            carousel.css({
                'width': o.carouselWidth + 'px',
                'height': o.carouselHeight + 'px'
            }).bind('mouseover', slidesMouseOver).bind('mouseout', slidesMouseOut);
            //描述也绑定鼠标移入停留，移出开始动的事件。 by yangye
            $('.description').bind('mouseover', slidesMouseOver).bind('mouseout', slidesMouseOut);
            for (var i = 0; i < n; i++) {
                var item = slideItems.eq(i);
                item.css(setSlidePosition(slidePos(i))).bind('click', slideClick);
                slideItems.eq(slidePos(i)).css({'z-index': zIndex(i)});
                images.eq(i).css(setImageSize(slidePos(i)));
                var op = item.css('opacity');
                if (op == 0) {
                    item.hide();
                }
                else {
                    item.show();
                }
            }
        };
        var hideItem = function (slide) {
            var op = slide.css('opacity');
            if (op == 0) {
                slide.hide();
            }
        };
        var goTo = function (index, isStopAutoplay, isPause) {
            if (isAnimationRunning == true) {
                return;
            }
            var o = settings, n = numberSlides;
            if (isStopAutoplay == true) {
                stopAutoplay();
            }
            targetSlide = index;
            if (targetSlide == n) {
                targetSlide = 0;
            }
            if (targetSlide == -1) {
                targetSlide = n - 1;
            }
            o.before(self);
            animateSlide();
            pause = isPause;
        };
        var animateSlide = function () {
            var o = settings, n = numberSlides;
            if (isAnimationRunning == true) {
                return;
            }
            if (currentSlide == targetSlide) {
                isAnimationRunning = false;
                return;
            }
            isAnimationRunning = true;
            hideDesc(currentSlide);
            if (currentSlide > targetSlide) {
                var forward = n - currentSlide + targetSlide, backward = currentSlide - targetSlide;
            }
            else {
                var forward = targetSlide - currentSlide, backward = currentSlide + n - targetSlide;
            }
            if (forward > backward) {
                dir = -1;
            }
            else {
                dir = 1;
            }
            currentSlide += dir;
            if (currentSlide == n) {
                currentSlide = 0;
            }
            if (currentSlide == -1) {
                currentSlide = n - 1;
            }
            hideVideoOverlay();
            buttonNavState();
            showDesc(currentSlide);
            for (var i = 0; i < n; i++) {
                animateImage(i);
            }
        };
        var animateImage = function (i) {
            var o = settings, item = slideItems.eq(i), pos = slidePos(i);
            item.show();
            item.animate(setSlidePosition(pos), o.speed, 'linear', function () {
                hideItem($(this));
                if (i == numberSlides - 1) {
                    isAnimationRunning = false;
                    if (currentSlide != targetSlide) {
                        animateSlide();
                    }
                    else {
                        self.current = currentSlide;
                        showVideoOverlay(currentSlide);
                        o.after(self);
                    }
                }
            });
            item.css({'z-index': zIndex(pos)});
            slideImage.eq(i).animate(setImageSize(pos), o.speed, 'linear');
            if (o.reflection == true) {
                animateReflection(o, item, i);
            }
            if (o.shadow == true) {
                animateShadow(o, item, i);
            }
        };
        var slideClick = function (event) {
            var $this = $(this);
            if ($this.index() != currentSlide) {
                goTo($this.index(), true, false);
                return false;
            }
        };
        var reflectionHeight = function (p) {
            var h = 0, o = settings;
            if (o.reflection == true) {
                h = o.reflectionHeight * setImageSize(p).height;
            }
            return h;
        };
        var initReflection = function () {
            var o = settings, items = slideItems, images = slideImage, n = numberSlides, opc = o.reflectionOpacity, start = 'rgba(' + o.reflectionColor + ',' + opc + ')', end = 'rgba(' + o.reflectionColor + ',1)';
            var style = '<style type="text/css">';
            style += '.slideItem .gradient {';
            style += 'position:absolute; left:0; top:0; margin:0; padding:0; border:none; width:100%; height:100%; ';
            style += 'background: -moz-linear-gradient(' + start + ',' + end + '); ';
            style += 'background: -o-linear-gradient(' + start + ',' + end + '); ';
            style += 'background: -webkit-linear-gradient(' + start + ',' + end + '); ';
            style += 'background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(' + start + '), to(' + end + ')); ';
            style += 'background: linear-gradient(' + start + ',' + end + '); ';
            style += '} ';
            style += '.slideItem .reflection {';
            style += 'filter: progid:DXImageTransform.Microsoft.Alpha(style=1,opacity=' + (opc * 100) + ',finishOpacity=0,startX=0,finishX=0,startY=0,finishY=100)';
            style += '-ms-filter: progid:DXImageTransform.Microsoft.Alpha(style=1,opacity=' + (opc * 100) + ',finishOpacity=0,startX=0,finishX=0,startY=0,finishY=100)';
            style += '}';
            style += '</style>';
            $(style).appendTo('head');
            for (var i = 0; i < n; i++) {
                var src = images.eq(i).attr('src'), sz = setImageSize(i);
                $('<div class="reflection"></div>').css({
                    'position': 'absolute',
                    'margin': '0',
                    'padding': '0',
                    'border': 'none',
                    'overflow': 'hidden',
                    'left': '0',
                    'top': setImageSize(i).height + 'px',
                    'width': '100%',
                    'height': reflectionHeight(i)
                }).appendTo(items.eq(i)).append($('<img src="' + src + '" />').css({
                    'width': sz.width + 'px',
                    'height': sz.height + 'px',
                    'left': '0',
                    'margin': '0',
                    'padding': '0',
                    'border': 'none',
                    '-moz-transform': 'rotate(180deg) scale(-1,1)',
                    '-webkit-transform': 'rotate(180deg) scale(-1,1)',
                    '-o-transform': 'rotate(180deg) scale(-1,1)',
                    'transform': 'rotate(180deg) scale(-1,1)',
                    'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)',
                    '-ms-filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)'
                })).append('<div class="gradient"></div>');
            }
        };
        var animateReflection = function (option, item, i) {
            var ref = item.children('.reflection'), speed = option.speed, sz = setImageSize(slidePos(i));
            ref.animate({'top': sz.height + 'px', 'height': reflectionHeight(slidePos(i))}, speed, 'linear');
            ref.children('img').animate(sz, speed, 'linear');
        };
        var shadowHeight = function (p) {
            var sh = 0;
            if (settings.shadow == true) {
                sh = 0.1 * setImageSize(p).height;
            }
            return sh;
        };
        var shadowMiddleWidth = function (p) {
            var w, s = slideItems.eq(p).find('.shadow'), sL = s.children('.shadowLeft'), sR = s.children('.shadowRight'), sM = s.children('.shadowMiddle');
            return w = setImageSize(p).width - (sL.width() + sR.width());
        };
        var initShadow = function () {
            var items = slideItems, n = numberSlides, sWidth = setImageSize(0).width, sInner = '<div class="shadowLeft"></div><div class="shadowMiddle"></div><div class="shadowRight"></div>';
            if (settings.hAlign != 'center') {
                sWidth = setImageSize(n - 1).width;
            }
            for (var i = 0; i < n; i++) {
                var item = items.eq(i);
                $('<div class="shadow"></div>').css({
                    'width': sWidth + 'px',
                    'z-index': '-1',
                    'position': 'absolute',
                    'margin': '0',
                    'padding': '0',
                    'border': 'none',
                    'overflow': 'hidden',
                    'left': '0',
                    'bottom': '0'
                }).append(sInner).appendTo(item).children('div').css({'position': 'relative', 'float': 'left'});
                item.find('.shadow').children('.shadowMiddle').width(shadowMiddleWidth(i));
            }
        };
        var animateShadow = function (option, item, i) {
            item.find('.shadow').children('.shadowMiddle').animate({'width': shadowMiddleWidth(slidePos(i)) + 'px'}, option.speed, 'linear');
        };
        var initDirectionButton = function () {
            var el = element;
            el.append('<div class="nextButton"></div><div class="prevButton"></div>');
            el.children('.nextButton').bind('click', function (event) {
                goTo(currentSlide + 1, true, false);
            });
            el.children('.prevButton').bind('click', function (event) {
                goTo(currentSlide - 1, true, false);
            });
        };
        var initButtonNav = function () {
            var el = element, n = numberSlides, buttonName = 'bullet', activeClass = 'bulletActive';
            if (settings.buttonNav == 'numbers') {
                buttonName = 'numbers';
                activeClass = 'numberActive';
            }
            el.append('<div class="buttonNav"></div>');
            var buttonNav = el.children('.buttonNav');
            for (var i = 0; i < n; i++) {
                var number = '';
                if (buttonName == 'numbers') {
                    number = i + 1;
                }
                $('<div class="' + buttonName + '">' + number + '</div>').css({'text-align': 'center'}).bind('click', function (event) {
                    goTo($(this).index(), true, false);
                }).appendTo(buttonNav);
            }
            var b = buttonNav.children('.' + buttonName);
            b.eq(0).addClass(activeClass);
            buttonNav.css({'width': numberSlides * b.outerWidth(true), 'height': b.outerHeight(true)});
        };
        var buttonNavState = function () {
            var o = settings, buttonNav = element.children('.buttonNav');
            if (o.buttonNav == 'numbers') {
                var numbers = buttonNav.children('.numbers');
                numbers.removeClass('numberActive');
                numbers.eq(currentSlide).addClass('numberActive');
            }
            else {
                var bullet = buttonNav.children('.bullet');
                bullet.removeClass('bulletActive');
                bullet.eq(currentSlide).addClass('bulletActive');
            }
        };
        var initDesc = function () {
            var desc = $(settings.descriptionContainer), w = desc.width(), h = desc.height(), descItems = desc.children('div'), n = descItems.length;
            for (var i = 0; i < n; i++) {
                descItems.eq(i).hide().css({'position': 'absolute', 'top': '0', 'left': '0'});
            }
            descItems.eq(0).show();
        };
        var hideDesc = function (index) {
            var o = settings;
            if (o.description == true) {
                var desc = $(o.descriptionContainer);
                desc.children('div').eq(index).hide();
            }
        };
        var showDesc = function (index) {
            var o = settings;
            if (o.description == true) {
                var desc = $(o.descriptionContainer);
                desc.children('div').eq(index).show();
            }
        };
        var initSpinner = function () {
            var sz = setImageSize(0);
            $('<div class="spinner"></div>').hide().css(setSlidePosition(0)).css({
                'width': sz.width + 'px',
                'height': sz.height + 'px',
                'z-index': numberSlides + 3,
                'position': 'absolute',
                'cursor': 'pointer',
                'overflow': 'hidden',
                'padding': '0',
                'margin': '0',
                'border': 'none'
            }).appendTo(carousel);
        };
        var initVideo = function () {
            initSpinner();
            var sz = setImageSize(0);
            $('<div class="videoOverlay"></div>').hide().css(setSlidePosition(0)).css({
                'width': sz.width + 'px',
                'height': sz.height + 'px',
                'z-index': numberSlides + 2,
                'position': 'absolute',
                'cursor': 'pointer',
                'overflow': 'hidden',
                'padding': '0',
                'margin': '0',
                'border': 'none'
            }).bind('click', videoOverlayClick).appendTo(carousel);
            showVideoOverlay(currentSlide);
        };
        var showVideoOverlay = function (index) {
            if (slideItems.eq(index).children('a').hasClass('video')) {
                carousel.children('.videoOverlay').show();
            }
        };
        var hideVideoOverlay = function () {
            var car = carousel;
            car.children('.videoOverlay').hide().children().remove();
            car.children('.spinner').hide();
        };
        var addVideoContent = function () {
            var vo = carousel.children('.videoOverlay'), url = slideItems.eq(currentSlide).children('a').attr('href'), src = getVideo(url);
            $('<iframe></iframe>').attr({
                'width': vo.width() + 'px',
                'height': vo.height() + 'px',
                'src': src,
                'frameborder': '0'
            }).bind('load', videoLoad).appendTo(vo);
        };
        var videoOverlayClick = function (event) {
            addVideoContent();
            carousel.children('.spinner').show();
            $(this).hide();
            if (settings.autoplay == true) {
                stopAutoplay();
                pause = false;
            }
        };
        var videoLoad = function (event) {
            var car = carousel;
            car.children('.videoOverlay').show();
            car.children('.spinner').hide();
        };
        var runAutoplay = function () {
            intervalProcess = setInterval(function () {
                goTo(currentSlide + 1, false, true);
            }, settings.autoplayInterval);
        };
        var stopAutoplay = function () {
            if (settings.autoplay == true) {
                clearInterval(intervalProcess);
                return;
            }
        };
        this.prev = function () {
            goTo(currentSlide - 1, true, false);
        };
        this.next = function () {
            goTo(currentSlide + 1, true, false);
        };
        this.goTo = function (index) {
            goTo(index, true, false);
        };
        this.pause = function () {
            stopAutoplay();
            pause = false;
        };
        this.resume = function () {
            if (settings.autoplay == true) {
                runAutoplay();
            }
        };
    };
    $.fn.carousel = function (options) {
        var returnArr = [];
        for (var i = 0; i < this.length; i++) {
            if (!this[i].carousel) {
                this[i].carousel = new CarouselEvo(this[i], options);
                this[i].carousel.init();
            }
            returnArr.push(this[i].carousel);
        }
        return returnArr.length > 1 ? returnArr : returnArr[0];
    };
    $.fn.carousel.defaults = {
        hAlign: 'center',
        vAlign: 'center',
        hMargin: 0.4,
        vMargin: 0.2,
        frontWidth: 400,
        frontHeight: 300,
        carouselWidth: 1000,
        carouselHeight: 360,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backZoom: 0.8,
        slidesPerScroll: 5,
        speed: 500,
        buttonNav: 'none',
        directionNav: false,
        autoplay: true,
        autoplayInterval: 5000,
        pauseOnHover: true,
        mouse: true,
        shadow: false,
        reflection: false,
        reflectionHeight: 0.2,
        reflectionOpacity: 0.5,
        reflectionColor: '255,255,255',
        description: false,
        descriptionContainer: '.description',
        backOpacity: 1,
        before: function (carousel) {
        },
        after: function (carousel) {
        }
    };
})(jQuery);