/**
 * yuewen.js
 * @description 阅文官网一些交互脚本
 * @suthor zhangxinxu 
 * @createtime 2016-05-17
 * @version 1.0
*/


var YUEWEN = (function(doc, win, undefined) {
	// 状态类名常量
	var ACTIVE = 'active', REVERSE = 'reverse';

	var exports = {
		el: {},
		/**
			加载JS资源
		 * @param url {String} 加载的JS地址
		 * @param callback {Function} JS load完成后的回调
		*/
		load: function(url, callback) {
			var self = this;

			callback = callback || function() {};

			var eleScript = document.createElement('script');
		    
		    eleScript.onload = function() {
		        if (!eleScript.isInited) {
		            eleScript.isInited = true;
		            callback.call(self);
		        }
		    };
		    // 一般而言，低版本IE走这个
		    eleScript.onreadystatechange = function() {
		        if (!eleScript.isInited && /^loaded|complete$/.test(eleScript.readyState)) {
		            eleScript.isInited = true;
		            callback.call(self);
		        }
		    };

		    eleScript.src = url;

		    doc.getElementsByTagName('head')[0].appendChild(eleScript);
		},

		/**
		  图片等懒加载
		* @param images {Object} 图片们，包装器对象
		* @return 当前单例对象
		*/
		scrollLoading: function(images) {
			var cache = [];
			if (images && images.length) {
				images.each(function() {
					cache.push({
						obj: this,
						src: $(this).attr('data-src')
					});
				});

				var loading = function() {
					var winHeight = $(win).height(), winWidth = $(win).width();

					$.each(cache, function(index, data) {
						var ele = data.obj;
						if (!ele) {
							return;
						}

						var rect = ele.getBoundingClientRect();
						if (rect.left == 0 && rect.top == 0) {
							// 认为元素是隐藏的
							return;
						}

						// 是否在页面屏幕内的判断
						var width = ele.clientWidth, height = ele.clientHeight;
						// 垂直方向
						var isVerticalIn = false;
						if ((rect.top + height) >= 0 && rect.top < winHeight) {
							isVerticalIn = true;
						}

						// 水平方向
						var isHorizonalIn = false;
						if ((rect.left + width) >=0 && rect.left < winWidth) {
							isHorizonalIn = true;
						}

						if (isVerticalIn && isHorizonalIn) {
							// 认为是在页面屏幕中
							ele.src = data.src;
							ele.removeAttribute('data-src');
							// 此元素不在参与加载处理
							data.obj = null;
						}
					});
				};

				this.el.container.on('scroll', loading);
				this.el.container.on('resize', loading);

				// 初始化就先来一遍
				loading();
			}
		},

		/**
		  主页顶部的背景图和文字的切换
		* @param el {String|Object} 元素，指当前需要应用swipe事件的对象
		* @param type {String} 'left'/'right'指方向
		* @param callback {Function} 触发的方法
		* @return 当前单例对象
		*/
		swipe: function(el, type, callback) {
			var self = this;

			if ($.isFunction(callback) == false) {
				return self;
			}

			// 移动端swipeLeft或swipeRight切换
			var start = {
				x: 0,
				y: 0	
			}, delta = {};

			// 事件们的处理
			var events = {
				start: function(event) {
					var touches = event.touches[0];

					 // 起始坐标以及时间戳
					 start = {
						x: touches.pageX,
						y: touches.pageY,
				
						time: +new Date
					 };
				},
				move: function(event) {
					// 避免双指操作
					if ( event.touches.length > 1 || event.scale && event.scale !== 1 ) {
						return;
					}
					
					//event.preventDefault();
					
					var touches = event.touches[0];

					delta = {
						x: touches.pageX - start.x,
						y: touches.pageY - start.y
					}
				},
				end: function(event) {
					// 时间
					var duration = +new Date - start.time;
				
					// 是否是有效的 next/prev/up/down slide
					// 小于500毫秒
					var isValidSlide = Number(duration) < 500;

					if (isValidSlide) {
						var deltaX = Math.abs(delta.x), deltaY = Math.abs(delta.y);

						if (deltaX > 20 && deltaY < deltaX) {
							if ((delta.x < 0 && type == 'left') || (delta.x > 0 && type == 'right')) {
								// 左滑动
								callback.call(el[0], events);
							}
						}
						if (deltaY > 20 && deltaX < deltaY) {
							if ((delta.y < 0 && type == 'top') || (delta.y > 0 && type == 'bottom')) {
								// 左滑动
								callback.call(el[0], events);
							}
						}
					}

					// 坐标位置还原
					start = {};
				}
			};
			
			el.on("touchstart", events.start);
			el.on("touchmove", events.move);
			el.on("touchend", events.end);

			return self;
		},

		/**
		  主页顶部的背景图和文字的切换
		* @param buttons {String|Object} 可以是字符串，表示点击按钮的选择器们；也可以直接是jQuery或Zepto的包装器对象
		* @param callback {Function} 切换完成后的回调
		* @return 当前单例对象
		*/
		slide: function(buttons, callback) {
			var self = this;
			if (typeof buttons == 'string') {
				// buttons作为选择器处理
				buttons = $(buttons);
			}

			if (buttons && buttons.length) {
				var current = 0;
				var targets = $.map(buttons, function(button, index) {
					var hash = '';

					button = $(button);

					if (button.hasClass(ACTIVE)) {
						current = index;
					} else if ((hash = button.attr('data-hash')) && location.hash.replace('#', '') == hash) {
						current = index;
					}
					return $('#' + button.data('index', index).attr('data-rel'));
				});

				buttons.eq(current).addClass(ACTIVE);


				buttons.on('click', function() {
					var button = $(this), index = +button.data('index');

					if (button.hasClass(ACTIVE) == false) {
						_slide(index);
					}
				});

				var _slide = function(index) {
					buttons.eq(current).removeClass(ACTIVE);
					buttons.eq(index).addClass(ACTIVE);
					$(targets[current]).removeClass(ACTIVE);
					$(targets[index]).addClass(ACTIVE);

					if ($.isFunction(callback)) {
						callback.call(self, buttons.eq(index), targets[index], buttons.eq(current), targets[current]);
					}
					current = index;
				};
			}

			return this;
		},

		/* 头部背景图片预加载，这样切换的时候，会更自然 */
		slidePreload: function() {
			var self = this;

			// if (self.isPreload) {
			// 	return self;
			// }

			// var elHeader = self.el.header;

			// var elWithBg = elHeader.find('s');

			// elWithBg.each(function() {
			// 	var el = $(this);
	
			// 	// get background-image
			// 	var bg = el.css('background-image');
			// 	// get image url
			// 	var url = bg.split('"')[1];
			// 	// trigger load image
			// 	var img = new Image();
			// 	img.src = url;
			// });

			self.isPreload = true;

			return self;
		},

		slideHomeApp: function() {
			var self = this;

			// 移动产品选项卡
			var elTabX = (self.el.tabApp = $('#tabApp'));
			var elTabLine = (self.el.tabLine = $('#tabLine'));

			// 切换按钮　
			var elTabBtns = elTabX.find('a');
			// 选项卡的回调方法
			var _callbackTab = function(isTrigger) {
				var elActive = elTabX.find('.' + ACTIVE), left = 0;
				if (elActive.length) {
					// 高亮线应该移动的位置
					left = elActive.position().left;
					// 宽度变化
					elTabLine.css({
						width: elActive.width()
					});

					if (history.pushState) {
						// 使用tranform动画效果更好
						elTabLine.css({
							webkitTransform: 'translateX('+ left +'px)',
							transform: 'translateX('+ left +'px)'
						});
					} else {
						elTabLine.css({
							left: elActive.position().left
						});
					}
				}

				// 如果是app页面，同事变更整个页面的APP类型
				if (win.FN_hash && isTrigger !== true) {
					var hash = elActive.attr('data-hash');
					location.replace(location.href.split('#')[0] + '#' + hash);
					FN_hash();

					// 滚动加载图片显示
					self.el.container.trigger('scroll');
				}
			};
			self.slide(elTabBtns, _callbackTab);
			// 蓝色高亮线一开始就显示
			_callbackTab(true);

			// 移动端增加swipe切换的处理
			if (win.SIZE == 'S') {
				var elUl = $('#mobile ul');
				self.swipe(elUl, 'left', function() {
					var index = elTabX.find('.' + ACTIVE).data('index') * 1;

					index++;
					if (index > elTabBtns.length - 1) {
						index = 0;
					}
					// 切换进行
					elTabBtns.eq(index).trigger('click');
				});
				self.swipe(elUl, 'right', function() {
					var index = elTabX.find('.' + ACTIVE).data('index') * 1;

					index--;
					if (index < 0) {
						index = elTabBtns.length - 1;
					}

					// 切换进行
					elTabBtns.eq(index).trigger('click');
				});

				// 移动端不在新窗口打开
				$('#mobile a').removeAttr('target');
			}

			return self;
		},

		slideBrand: function() {
			var self = this;

			// 一些元素
			var elBrandDescX = (self.el.brandDescX = $('#brandDescX'));
			var elBrandNavX = (self.el.brandNavX = $('#brandNavX'));

			var elDescLs, elNavLs;

			if (elBrandDescX.length && elBrandNavX.length) {
				// 必要的元素检测
				// 如果没有异常，导航按钮和列表元素集合
				elDescLs = elBrandDescX.find('li');
				elNavLs = elBrandNavX.find('a');
				// nav导航和列表是一一对应的关系，因此，我们可以借助索引
				// 注意：此实现方法并不适用多人协作的项目，因为列表等具有变动性
				elNavLs.each(function(index) {
					$(this).data('index', index)
					// 事件
					.on('mouseenter', function() {
						var elNav = $(this), elActive = null, indexActive = -1, indexCurrent = elNav.data('index');

						// 避免鼠标误hover触发交互
						clearTimeout(self.timerNavHover);
						// 定时器保护，增加225毫米的延迟
						self.timerNavHover = setTimeout(function() {
							if (elNav.hasClass(ACTIVE) === false) {
								elActive = elBrandNavX.find('.' + ACTIVE);
								if (elActive.length == 1) {
									indexActive = elActive.data('index');
									elActive.removeClass(ACTIVE);
								}
								elNav.addClass(ACTIVE);
								// 对应的品牌动画效果
								// 1. 首先确定动画是否反方向，根据nav按钮在DOM中的前后顺序决定
								var isResverse = false;
								if (indexCurrent < indexActive) {
									isResverse = true;
								}

								var elDescActive = elDescLs.eq(indexActive);
								if (elDescActive.length) {
									elDescActive.removeClass('in').removeClass(REVERSE).addClass('out');
									if (isResverse) {
										elDescActive.addClass(REVERSE);
									}
								}
								elDescLs.eq(indexCurrent).addClass('in').removeClass(REVERSE).removeClass('out');
								if (isResverse) {
									elDescLs.eq(indexCurrent).addClass(REVERSE);
								}
							}
						}, 225);
							
					});
				});
				// 当从导航区域离开的时候，清除定时器
				elBrandNavX.on('mouseleave', function() {
					clearTimeout(self.timerNavHover);
				});
			}

			return self;
		},

		slideHomeHeader: function() {
			var self = this;

			
			// 头部元素
			var elHeader = self.el.header, elDots = self.el.dots;
			// hover时候预加载（如果没有预加载过的话）
			if (elHeader.length) {
				var _autoplay = function() {
					if (!self.timerSlide) {
						self.timerSlide = setInterval(function() {
							var index = $('#hdDotX .' + ACTIVE).data('index')*1 + 1;
							if (!elDots[index]) {
								index = 0;
							}
							elDots.eq(index).trigger('click');
						}, 5000);
					}
				};
				
				if (win.SIZE !== 'S') {
					// 自动播放需要用户特定行为开启
					elHeader.on('mouseenter', function() {
						// 预加载
						// self.slidePreload();
						// 停止自动播放
						clearInterval(self.timerSlide);
						self.timerSlide = null;
					}).on('mouseleave', function() {
						// 继续自动播放
						_autoplay();
					});
					// 自动播放
					$(doc).on('mouseover', function() {
						if (!self.isPreload) {
							setTimeout(function() {
								if (!self.isPreload) {
									self.slidePreload();
								}
							}, 4000);

							// 鼠标进入页面，开启自动播放，用户不动我也不动
							setTimeout(function() {
								_autoplay();
							}, 5000);
						}
					});
				} else {
					self.swipe(elHeader, 'left', function() {
						var index = $('#hdDotX .' + ACTIVE).data('index') * 1;

						index++;
						if (index > elDots.length - 1) {
							index = 0;
						}
						// 切换进行
						elDots.eq(index).trigger('click');
					});
					self.swipe(elHeader, 'right', function() {
						var index = $('#hdDotX .' + ACTIVE).data('index') * 1;

						index--;
						if (index < 0) {
							index = elDots.length - 1;
						}

						// 切换进行
						elDots.eq(index).trigger('click');
					});
				}
			}

			return this;
		},

		scrollBarFixed: function() {
			var self = this;
			var elHeader = self.el.header, container = self.el.container;

			// 标题栏
			self.el.hdBar = $('#ywHdBar');

			var elBar;
			// 标题栏导航按钮
			var elBarNav = $('#ywMnavBtn'), elBarNavName = $('#ywMnavName');
			self.el.barNav = elBarNav;

			// 当前导航位置
			var indexNav = 0;

			// 标记锚点对应的元素们
			var arrModule = [];
			var elMnavAs = $('#ywMnav > a').each(function(index) {
				var href = this.getAttribute('href');
				if (/^#/.test(href)) {
					arrModule.push($(href));
				}
				// 跟网页hash地址匹配
				var hash = location.hash.replace('&', '');
				if (hash == href) {
					indexNav = index;
				}
			});


			if (elHeader.length) {
				// 移动端顶部fixed效果
				if (win.SIZE == 'S') {
					elBar = self.el.hdBar;

					container.on('scroll', function(event) {
						var st = $(this).scrollTop(), distance = 50;
						
						if (st <= 0) {
							elBar.removeClass('fixed');
							elBar.css('opacity', 1);
						} else {
							elBar.addClass('fixed');
							elBar.css('opacity', Math.min(st, 30) / 30);
						}

						// 标题栏导航按钮默认选中内容变化
						var arrTop = $.map(arrModule, function(module) {
							return module[0].getBoundingClientRect().top;
						}), arrTopAbs = $.map(arrTop, function(top) {
							return Math.abs(top);
						});

						// 谁距离最小就是哪一个，头尾特殊处理
						var min = Math.min.apply(null, arrTopAbs);

						// 首位锚点元素特殊处理，其他谁最小就是谁
						$.each(arrTop, function(index, top) {
							if (
								(index == 0 && top > 0) ||
								(index == arrTop.length - 1 && top < 0) ||
								(Math.abs(top) == min)
							) {
								elMnavAs.removeClass(ACTIVE);
								elBarNavName.html(elMnavAs.eq(index).addClass(ACTIVE).html());

								indexNav = index;
							}
						});
					});


					// 标题栏不能拖动
					// elBar.on('touchstart', function(event) {
					// 	if ($(event.target).is('a') == false) {
					// 		event.preventDefault();
					// 	}
					// });

					// 移动端导航的出现与收起
					elBarNav.on('touchstart', function() {
						$(this).toggleClass(ACTIVE);
					});
				} else if (!win.APP) {
					// 非移动端的处理
					// 官网首页的滚动交互
					elBar = $('#ywBarX');

					if (elBar.length == 0) {
						return self;
					}

					self.el.barX = elBar;

					// 当前的类名
					var cl = elBar[0].className.split(' ')[0] + '-fixed';

					// 导航状态切换的方法
					var fnStatus = function(index, isHash) {
						// 导航状态切换
						elMnavAs.removeClass(ACTIVE);
						elMnavAs.eq(index).addClass(ACTIVE);

						var href = elMnavAs.eq(index).attr('href');

						if (/#/.test(href)) {
							location.replace('#&' + href.split('#')[1]);
						}

						indexNav = index;
					};

					self.el.container.on('scroll', function() {
						var st = $(this).scrollTop();
						if (st <= 0) {
							elBar.removeClass(cl);
							elBar.css('opacity', 1);
						} else {
							elBar.addClass(cl);
							elBar.css('opacity', Math.min(st, 50) / 50);
						}

						// 如果是点击触发，没有这么多事情
						if (self.triggerScroll) {
							$.each(arrModule, function(index, el) {
								if (el[0] == self.triggerScroll) {
									indexNav = index;
								}
							});
							return;
						}

						// 如果是最大滚动高度
						if (st == doc.documentElement.scrollHeight - doc.documentElement.clientHeight) {
							indexNav = arrModule.length - 1;
							fnStatus(indexNav, true);
							return;
						}

						// 标题栏导航按钮默认选中内容变化
						$.each(arrModule, function(index, module) {
							var ele = module[0];
							if (indexNav !== index && Math.abs(ele.getBoundingClientRect().top) <= 75) {
								// 导航状态切换
								fnStatus(index, true);
							}
						});
					});

					if (indexNav != 0) {
						fnStatus(indexNav);
					}

					self.el.container.trigger('scroll');
				}
			}

			return self;
		},

		tapHomeCopy: function() {
			var self = this;

			// 全版权运营移动端
			self.el.copy = $('#ywCopyX');

			var timerLongTap = null, targetLongTap = null;
			var elCopy = self.el.copy;
			if (elCopy.length && win.SIZE == 'S') {
				// 小屏幕下的滚动位置
				var willLeft = Math.round((elCopy[0].scrollWidth - elCopy.width()) / 2);
				elCopy.scrollLeft(willLeft);
				// 触发滚动加载
				elCopy.on('scroll', function() {
					self.el.container.trigger('scroll');
					// 隐藏滚动提示
					if (!this.scrollEd && elCopy.scrollLeft() !== willLeft) {
						$('#copyright svg').hide();
						this.scrollEd = true;
					}
				});

				// 手指滑动不认为是长按
				var posCopy = {
					x: 0,
					y: 0
				}
				elCopy.find('li > div').on({
					touchstart: function(event) {
						var target = event.touches[0] || event;

						posCopy = {
							x: target.pageX,
							y: target.pageY
						};

						var li = this;
						// 检测是否长按
						targetLongTap = li;

						timerLongTap = setTimeout(function() {
							if (targetLongTap == li) {
								$(li).addClass(ACTIVE);
							}
						}, 500);
					}
				});

				$(doc).on('touchend', function() {
					clearTimeout(timerLongTap);
					targetLongTap = null;
					elCopy.find('.' + ACTIVE).removeClass(ACTIVE);
				}).on('touchmove', function(event) {
					var target = event.touches[0] || event;
					if (Math.abs(target.pageX - posCopy.x) > 5 || Math.abs(target.pageY - posCopy.y) > 5) {
						clearTimeout(timerLongTap);
					}
				});
			} else if (elCopy.length) {
				// PC移动到边缘呈现处理
				var ul = elCopy.find('ul');

				var marginLeft = parseInt(ul.css('marginLeft'));

				// 事件
				ul.find('li').on('mouseenter', function() {
					// 当前是否有在屏幕之外的
					var rect = this.getBoundingClientRect(), move = 0, winWidth = $(win).width();
					
					if (rect.left < 0 || rect.right > winWidth) {
						if (rect.left < 0) {
							move = -1 * rect.left;
						} else {
							move = winWidth - rect.right;
						}
						move = Math.round(move);

						if ([].map) {
							// IE9+ transform
							ul.css({
								msTransform: 'translateX('+ move +'px)',
								transform: 'translateX('+ move +'px)'
							});
						} else {
							ul.css('marginLeft', marginLeft + move);
						}
					}
				}).on('mouseleave', function() {
					if ([].map) {
						// IE9+ transform
						ul.css({
							msTransform: 'none',
							transform: 'none'
						});
					} else {
						ul.css('marginLeft', marginLeft);
					}
				});
			}

			return self;
		},

		

		/**
		  简易弹框显示图片
		* @param url {String} 图片地址
		* @return 当前单例对象
		*/
		showImage: function(url) {
			var self = this;
			// 蒙层兼弹框元素
			var overlay = self.el.overlay;
			if (!overlay) {
				overlay = $('#ywOverlay');
				overlay.data('origin', overlay.html()).on('click', function() {
					$(this).removeClass(ACTIVE).hide();
				});
				self.el.overlay = overlay;
			} else if (overlay.data('lasturl') === url) {
				// 直接显示
				overlay.addClass(ACTIVE).show();
				return;
			} else {
				// 清除图片相关HTML
				overlay.html(overlay.data('origin'));
			}

			var box = overlay.children('div').removeAttr('style');


			// 显示loading状态
			overlay.show();

			// get图片
			var image = new Image();
			image.onload = function() {
				var width = this.width, height = this.height;

				// 故意来点延迟，包装效果更自然
				setTimeout(function() {
					box.css({
						width: width,
						height: height
					}).html('<img src="'+ url +'">');

					overlay.data('lasturl', url);
				}, 200);
			};
			image.error = function() {
				box.html('<div class="error">图片没有加载出来，可以稍后重试。</div>');
			};
			image.src = url;

			return this;
		},

		/**
		  页面滚动到对应元素位置
		* @param el {Object} jQuery或Zepto的包装器对象
		* @param callback {Function} 滚动到位的回调函数
		* @return 当前单例对象
		*/
		scrollIntoView: function(el, callback, direction) {
			var self = this;

			var $win = self.el.container;

			// 方向
			direction = direction || 'top';

			// 滚动方法名称
			var scrollMethod = 'scroll' + direction.slice(0,1).toUpperCase() + direction.slice(1, direction.length)



			if (el && el.length) {
				// 清除定时器
				clearTimeout(self.timerScroll);

				// 需要滚动的高度
				var st = $win[scrollMethod](), offT = el.offset()[direction] + st;

				// 手机模式下，要增加顶部工具栏的偏移大小
				if (win.SIZE == 'S') {
					offT -= 50;
				} else if(!win.APP) {
					offT = el.offset()[direction] - 74;
				}

				// 速率，当前滚动位置
				var rate = 10, nowSt = st;

				var step = function() {
					var move = (offT - nowSt) / rate;
					if (Math.abs(move) < 1 / rate) {
						$win[scrollMethod](offT);
						if ($.isFunction(callback)) {
							callback.call(el[0]);
						}
					} else {
						nowSt = nowSt + move;
						$win[scrollMethod](nowSt);
						self.timerScroll = setTimeout(step, 20);
					}
				};
				step();
			}
			return self;
		},

		/**
		  整站通用的交互事件处理
		*/
		eventsGlobal: function() {
			var self = this;

			

			$(doc).delegate('a', 'click', function(event) {
				var hrefAttr = this.getAttribute('href'), href = this.href;
				// 页面锚点跳转
				if (/^#/.test(hrefAttr)) {
					self.scrollIntoView($(hrefAttr), function() {
						// 标记当前hash
						if (win.SIZE != 'S') {
							location.replace('#&' + hrefAttr.split('#')[1]);
							self.triggerScroll = null;
						}
					});

					if (win.SIZE == 'S') {
						
					} else if (/nav/.test(this.className)) {
						self.triggerScroll = this;
						$(this).addClass(ACTIVE).siblings('a').removeClass(ACTIVE);
					}

					event.preventDefault();
				}
				// 打开图片
				else if (/\.(?:png|jpg)$/.test(hrefAttr)) {
					self.showImage(hrefAttr);

					event.preventDefault();
				} else if (/#/.test(hrefAttr)) {
					// IE7 maybe
					$(this).parent().find('.' + ACTIVE).removeClass(ACTIVE);
					$(this).addClass(ACTIVE);
				}
			});

			// 资源的滚动加载
			this.scrollLoading($('img[data-src]'));

			return self;
		},


		/**
		  官网首页的一些交互脚本
		*/
		eventsHome: function() {
			var self = this;
			
			// 首页顶部banner切换
			self.slideHomeHeader();

			// 顶部栏拖动跟随效果
			self.scrollBarFixed();

			// 首页app选项卡
			self.slideHomeApp();

			// 品牌切换交互效果
			self.slideBrand();

			// 版权运营移动端长按出现描述
			self.tapHomeCopy();

			// 移动端收起导航
			var elBarNav;
			if (win.SIZE == 'S') {
				elBarNav = self.el.barNav || $('#ywMnavBtn');
				$('#ywMnav').click(function() {	
					elBarNav.removeClass(ACTIVE);
				});
			}

			return self;
		},

		/**
		  app详情页面的一些交互脚本
		*/
		eventsApp: function() {
			var self = this;
			// 判断iOS还是Android
			var regAndroid = /Android/i, isAndroid = regAndroid.test(navigator.userAgent);

			// 移动端下载按钮动态地址
			$('.dlBtn').each(function() {
				var ele = this;
				var href = ele.getAttribute('href');
				if (href == '') {
					// 从前面2个a标签按钮处获得响应的下载地址
					$(ele).siblings('a').each(function() {
						var html = this.innerHTML;
						if (isAndroid && regAndroid.test(html)) {
							ele.href = this.href;
						} else if (isAndroid == false && /ios/i.test(html)) {
							ele.href = this.href;
						}
					});
				}
			});


			// 顶部栏拖动跟随效果
			self.scrollBarFixed();

			// 首页app选项卡
			self.slideHomeApp();

			// IE7,IE8图片满屏显示
			var scale = 1;
			// 图片宽度是1440，所以，可以对比下尺寸
			if (![].map && (scale = $(win).width() / 1440) > 1) {
				// 图片超出剪裁
				self.el.header.css('overflow', 'hidden')
				// 比例放大以及重定位
				.find('s').each(function() {
					var elS = $(this);
					elS.css('zoom', scale).css('left', -0.5 * $(win).width() * (scale - 1));
				});
			}

			// 选项卡hover头图预加载
			var elTabX = self.el.tabApp;
			if (elTabX) {
				elTabX.find('a').on({
					mouseenter: function() {
						var ele = this, el = $(ele), index = -1, imgurl = '';
						if (!ele.isPreload) {
							index = +el.data('index') + 1;

							imgurl = $('#hdAPP' + index).find('s').css('background-image');
							if (imgurl) {
								imgurl = imgurl.split('"')[1];
								if (imgurl) {
									new Image().src = imgurl;
								}
							}
						}

						ele.isPreload = true;
					}
				});
			}

			return self;
		},

		init: function() {
			var self = this;
			// 确定页面的容器
			// 移动端是页面
			self.el.container = (win.SIZE == 'S'? $('#ywPage'): $(win));
			// 一些全局元素
			self.el.header = $('#ywHeader');
			self.el.dots = $('#hdDotX a');

			if (win.APP) {
				self.eventsApp();
			} else {
				self.eventsHome();
			}

			self.eventsGlobal();

			return self;
		}
	};

	return exports;
})(document, window);