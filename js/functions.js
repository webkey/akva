/**
 *! resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth != currentWidth;
	if(resizeByWidth){
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});
/*resize only width end*/

/**
 * device detected
 * */
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

/**
 *! placeholder
 *  */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/*placeholder end*/

/**!
 *  multiselect init
 * */
/*! add ui position add class */
function addPositionClass(position, feedback, obj){
	removePositionClass(obj);
	obj.css( position );
	obj
		.addClass( feedback.vertical )
		.addClass( feedback.horizontal );
}

/*! add ui position remove class */
function removePositionClass(obj){
	obj.removeClass('top');
	obj.removeClass('bottom');
	obj.removeClass('center');
	obj.removeClass('left');
	obj.removeClass('right');
}

function customSelect(select){
	if ( select.length ) {
		selectArray = [];
		select.each(function(selectIndex, selectItem){
			var placeholderText = $(selectItem).attr('data-placeholder');
			var flag = true;
			if ( placeholderText === undefined ) {
				placeholderText = $(selectItem).find(':selected').html();
				flag = false;
			}
			var classes = $(selectItem).attr('class');
			selectArray[selectIndex] = $(selectItem).multiselect({
				// appendTo: ".select",
				header: false,
				height: 'auto',
				minWidth: 50,
				selectedList: 1,
				classes: classes,
				multiple: false,
				noneSelectedText: placeholderText,
				show: ['fade', 100],
				hide: ['fade', 100],
				create: function(event){
					var select = $(this);
					var button = $(this).multiselect('getButton');
					var widget = $(this).multiselect('widget');
					button.wrapInner('<span class="select-inner"></span>');
					button.find('.ui-icon').append('<i class="arrow-select"></i>')
						.siblings('span').addClass('select-text');
					widget.find('.ui-multiselect-checkboxes li:last')
						.addClass('last')
						.siblings().removeClass('last');
					if ( flag ) {
						$(selectItem).multiselect('uncheckAll');
						$(selectItem)
							.multiselect('widget')
							.find('.ui-state-active')
							.removeClass('ui-state-active')
							.find('input')
							.removeAttr('checked');
					}
				},
				selectedText: function(number, total, checked){
					var checkedText = checked[0].title;
					return checkedText;
				},
				position: {
					my: 'left top',
					at: 'left bottom',
					using: function( position, feedback ) {
						addPositionClass(position, feedback, $(this));
					}
				}
			});
		});
		$(window).resize(selectResize);
	}
}

function selectResize(){
	if ( selectArray.length ) {
		$.each(selectArray, function(i, el){
			var checked = $(el).multiselect('getChecked');
			var flag = true;
			if ( !checked.length ) {
				flag = false
			}
			$(el).multiselect('refresh');
			if ( !flag ) {
				$(el).multiselect('uncheckAll');
				$(el)
					.multiselect('widget')
					.find('.ui-state-active')
					.removeClass('ui-state-active')
					.find('input')
					.removeAttr('checked');
			}
			$(el).multiselect('close');
		});
	}
}
/* multiselect init end */

/**
 *! print
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}
/*print end*/

/**
 *! parallax on mousemove
 * */
(function () {
	var ParallaxJs = function (setting){
		var options = $.extend({
			parallaxElement: null,
			parallaxArea: null,
			parallaxDelta: 20
		}, setting || {});

		this.parallaxElement = document.querySelector(options.parallaxElement);
		this.parallaxArea = document.querySelector(options.parallaxArea);
		this.parallaxDelta = options.parallaxDelta;
		this.win = {
			width: window.innerWidth,
			height: window.innerHeight
		};

		this.bindEvents();
	};

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	ParallaxJs.prototype.throttle = function(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	};

	ParallaxJs.prototype.bindEvents = function () {
		var self = this;
		var parallaxElement = self.parallaxElement;
		var win = self.win;
		var area = self.parallaxArea;
		var delta = self.parallaxDelta;

		parallaxElement.style.WebkitTransform = "-webkit-transform 0.4s";
		parallaxElement.style.transition = "transform 0.4s";
		// parallaxElement.style.WebkitbackfaceVisibility = "-webkit-hidden";
		// parallaxElement.style.backfaceVisibility = "hidden";

		//parallaxElement.style.WebkitTransition = '-webkit-transform 0.4s';
		//parallaxElement.style.transition = 'transform 0.4s';

		area.addEventListener('mousemove', self.throttle(function(ev) {
			var offsetLeftArea = area.getBoundingClientRect().left;
			var transX = - (120 + ev.clientX - offsetLeftArea - area.offsetWidth / 2) / delta;
			// var transX = 50/(win.width) * ev.clientX - 0;
			// xVal = -1/(win.height/2)*ev.clientY + 1,
			// yVal = 1/(win.width/2)*ev.clientX - 1,
			// transY = 20/(win.height)*ev.clientY,
			// transZ = 100/(win.height)*ev.clientY;

			parallaxElement.style.WebkitTransform = 'translateX(' + transX + 'px)';
			parallaxElement.style.transform = 'translateX(' + transX + 'px)';
			// parallaxElement.style.WebkitTransform = 'perspective(1000px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(' + xVal + ',' + yVal + ',0,2deg)';
			// parallaxElement.style.transform = 'perspective(1000px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(' + xVal + ',' + yVal + ',0,2deg)';
		}, 100));
	};

	window.ParallaxJs = ParallaxJs;
}());

function parallaxMainSlider() {
	if (DESKTOP && window.innerWidth > 767) {
		var delta = 30;
		var img = '.index .main-slider-img';

		if (document.querySelector(img)) {
			new ParallaxJs({
				parallaxElement: img,
				parallaxArea: '.wrapper',
				parallaxDelta: delta
			});
		}

		var caption = '.index .main-slider-caption__holder';

		if (document.querySelector(caption)) {
			new ParallaxJs({
				parallaxElement: '.main-slider-caption__holder',
				parallaxArea: '.wrapper',
				parallaxDelta: delta
			});
		}

		var desk = '.index .main-slider-desks';

		if (document.querySelector(desk)) {
			new ParallaxJs({
				parallaxElement: desk,
				parallaxArea: '.wrapper',
				parallaxDelta: delta
			});
		}

		var bg = '.index .main-slider-bg';

		if (document.querySelector(bg)) {
			new ParallaxJs({
				parallaxElement: bg,
				parallaxArea: '.wrapper',
				parallaxDelta: delta + 30
			});
		}
	}
}
/**
 * parallax on mousemove end
 * */

/**
 *! main slider
 * */
function mainSlider() {
	// external js:
	// 1) Modernizr;

	'use strict';

	var $sliderContainer = $('.ms-js');
	if (!$sliderContainer.length) return false;

	var activeClass = 'active',
		activeClassPrev = 'active-prev',
		activeClassNext = 'active-next',
		touchSwipe = true,
		hash = window.location.hash,
		hashTag = hash.substring(1),
		initIndex = 0,
		index = initIndex,
		indexNext, indexPrev;

	var descript = '.ms-description-js';

	var $tab = [
		descript,
		'.ms-img-js',
		'.ms-bg-js',
		'.ms-desks-js'
		// '.ms-dots-js button'
	];

	$.each($sliderContainer, function () {
		var currentSlider = $(this);

		var currentSlideIndex = index;
		var totalLength = $(descript, currentSlider).length;

		slidesCounter(currentSlider, currentSlideIndex, totalLength);
	});

	/* html */
	// <div class="ms-dots-js">
	// <button class="active">1</button>
	// <button>2</button>
	// <button>3</button>
	// <button>4</button>
	// </div>
	/* html end */

	$('.ms-dots-js').on('click', 'button', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);

		if ($currentBtn.hasClass(activeClass)) return false;

		var $currentSlider = $currentBtn.closest($sliderContainer);
		index = $currentBtn.index();

		$currentSlider.on('msGoToSlide', index);

		return index;
	});

	$('.ms-arrow-js').on('click', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);
		var $currentSlider = $currentBtn.closest($sliderContainer);
		var length = $currentBtn.closest($sliderContainer).find(descript).length;

		if ($currentBtn.data('direction') === "prev") {
			msGoToPrevSlide($currentSlider, length);
		} else {
			msGoToNextSlide($currentSlider, length);
		}

		switchSlide($currentSlider,$tab,index);

		return index;
	});

	$sliderContainer.on('msGoToSlide', function (event, slideIndex, bool) {
		var $currentSlider = $(event.target);
		index = slideIndex;

		switchSlide($currentSlider,$tab,index, bool);

		return index;
	});

	$sliderContainer.on('msGoToSlideByTag', function (event, slideTag) {
		var $currentSlider = $(event.target);
		index = $currentSlider.find('[data-tag="' + slideTag + '"]').index();

		if (index < 0) {
			alert('Hashtag invalid. Selected first element');

			index = initIndex;
			switchSlide($currentSlider,$tab,index);

			return index;
		}

		switchSlide($currentSlider,$tab,index);

		return index;
	});

	changeSelectByMainSlider();
	function changeSelectByMainSlider() {
		var $setSelect = $('.set__select select');
		if ($setSelect.length) {
			$sliderContainer.on('msSliderChanged', function (event, item, index, tag) {
				if (tag === undefined) {
					console.info('Warning: The attribute "data-tag" is not specified for:');
					console.log($(item).eq(index));
				}

				$setSelect.val(tag);

				if (!Modernizr.touchevents) {
					$setSelect.multiselect('refresh');
				}
			})
		}
	}

	changeMainSliderBySelect();
	function changeMainSliderBySelect() {
		$('.set__select select').on('change', function (e) {
			var value = $(this).find('option:selected').val();
			$sliderContainer.trigger('msGoToSlideByTag', value);
			e.preventDefault();
		});
	}

	if (hash) {
		$sliderContainer.trigger('msGoToSlideByTag', hashTag);
	} else {
		$sliderContainer.trigger('msGoToSlide', index);
	}

	changeMainSliderByHash();
	function changeMainSliderByHash() {
		$sliderContainer.on('msSliderChanged', function (event, item, index, tag, bool) {
			if (bool !== false && tag !== undefined) {
				window.location.hash = tag;
				hashTag = tag;
			}
		});

		//detect the 'popstate' event - e.g. user clicking the back button
		$(window).on('popstate', function() {
			var tag = window.location.hash.substring(1);

			if (tag === "") {
				$sliderContainer.trigger('msGoToSlide', [0, false]);
				hashTag = tag;
			}

			if (tag !== hashTag && tag !== "" && index > -1) {
				$sliderContainer.trigger('msGoToSlideByTag', tag);
				hashTag = tag;
			}
		});
	}

	function switchSlide(slider,tab,index, bool) {
		var length = slider.find(descript).length;

		// if property "index" length class added
		// else class removed
		if (Array.isArray(tab)){
			for(var i = 0; i < tab.length; i++) {

				indexNext = (index < length - 1) ? index + 1 : 0;
				indexPrev = (index >= 0) ? index - 1 : length - 1;

				slider.find(tab[i])
					.eq(index).addClass(activeClass)
					.siblings().removeClass(activeClass);

				slider.find(tab[i])
					.eq(indexNext).addClass(activeClassNext)
					.siblings().removeClass(activeClassNext);

				slider.find(tab[i])
					.eq(indexPrev).addClass(activeClassPrev)
					.siblings().removeClass(activeClassPrev);
			}
		} else {
			slider.find(tab)
				.eq(index).addClass(activeClass)
				.siblings().removeClass(activeClass);
		}

		slidesCounter(slider,index,length);

		var tag = $(descript).eq(index).data('tag');

		// console.log("msSliderChanged - index: " + index + ", tag: " + tag);
		$(slider).trigger('msSliderChanged', [descript, index, tag, bool]);
	}

	function msGoToPrevSlide(slider, length) {
		if (index <= 0) {
			index = index - 1 + length;
		} else {
			index = index - 1;
		}
		slider.trigger('showedPrevSliderItem');
		return index;
	}

	function msGoToNextSlide(slider, length) {
		if (index >= length - 1) {
			index = index + 1 - length;
		} else {
			index = index + 1;
		}
		slider.trigger('showedNextSliderItem');
		return index;
	}

	function slidesCounter(slider, currentSlideIndex, totalLength) {
		$('.ms-current-slide-js', slider).text(currentSlideIndex + 1);
		$('.ms-total-js', slider).text(totalLength);
	}

	if (touchSwipe && !DESKTOP && window.innerWidth < 768) {
		$($sliderContainer).swipe({
			swipeRight: function () {

				var $currentSlider = $(this);
				var length = $currentSlider.find(descript).length;

				msGoToPrevSlide($currentSlider, length);

				switchSlide($currentSlider, $tab, index);

				// slidesCounter($currentSlider, index, length);

				return index;
			}, swipeLeft: function () {

				var $currentSlider = $(this);
				var length = $currentSlider.find(descript).length;

				msGoToNextSlide($currentSlider, length);

				switchSlide($currentSlider, $tab, index);

				// slidesCounter($currentSlider, index, length);

				return index;
			}
		});
	}
}
/*main slider end*/

/**
 *! info bar toggle
 * */
function classToggle() {
	var $html = $('html');
	var activeClassSidebar = "sidebar-show";
	var activeClassInfoBar = "info-bar-show";
	var activeClassGuide = "guide-show";

	// info bar toggle
	$('.info-btn-js a').on('mousedown touchstart vmousedown', function (e) {
		if ($('.info-bar-js').length) {
			e.preventDefault();

			$html.removeClass(activeClassSidebar);
			$html.toggleClass(activeClassInfoBar, !$html.hasClass(activeClassInfoBar));
		}
	});

	// sidebar toggle
	$('.btn-menu-js').on('mousedown touchstart vmousedown', function (e) {
		if ($('.sidebar-js').length) {
			e.preventDefault();

			$html.removeClass(activeClassInfoBar);
			$html.toggleClass(activeClassSidebar, !$html.hasClass(activeClassSidebar));
		}
	});

	// overlay toggle
	$html.on('click', '.show-panels__overlay', function (e) {
		e.preventDefault();

		$html.removeClass(activeClassInfoBar);
		$html.removeClass(activeClassSidebar);
	});

	// guide toggle
	$('.guide-opener-js').on('mousedown touchstart vmousedown', function (e) {
		if ($('.guide').length) {
			e.preventDefault();

			$html.toggleClass(activeClassGuide, !$html.hasClass(activeClassGuide));

			e.stopPropagation();
		}
	});

	$(document).on('click', function (e) {
		if ($html.hasClass(activeClassGuide) && !$(e.target).hasClass('guide__align') && !$(e.target).parents().hasClass('guide__align')) {
			$html.removeClass(activeClassGuide);
		}
	})
}
/*info bar toggle end*/

/**
 *! jquery.toggleHoverClass
 * */
//
(function ($) {
	// external js:
	// 1) Modernizr (touchevents)

	var HoverClass = function (settings) {
		var options = $.extend({
			container: 'ul',
			item: 'li',
			drop: 'ul',
			alwaysForTouch: false // always add hover class for touch devices
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.container);
		self.$container = container;
		self.$item = $(options.item, container);
		self.$drop = $(options.drop, container);
		self._alwaysForTouch = options.alwaysForTouch;

		self.modifiers = {
			hover: 'hover',
			hoverNext: 'hover_next',
			hoverPrev: 'hover_prev'
		};

		self.addClassHover();

		if (Modernizr.touchevents) {
			$(window).on('debouncedresize', function () {
				self.removeClassHover();
			});
		}
	};

	HoverClass.prototype.addClassHover = function () {
		var self = this,
			_hover = this.modifiers.hover,
			_hoverNext = this.modifiers.hoverNext,
			_hoverPrev = this.modifiers.hoverPrev,
			$item = self.$item,
			item = self.options.item,
			$container = self.$container;

		if (Modernizr.touchevents) {

			$container.on('click', ''+item+'', function (e) {
				var $currentAnchor = $(this);
				var currentItem = $currentAnchor.closest($item);

				if (currentItem.has(self.$drop).length && !self._alwaysForTouch){ return; }

				e.stopPropagation();

				if (currentItem.hasClass(_hover)){
					currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);
					return;
				}

				$('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
					.removeClass(_hover)
					.find('.'+_hover+'')
					.removeClass(_hover);
				currentItem.addClass(_hover);

				e.preventDefault();
			});

			$container.on('click', ''+self.options.drop+'', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$item.removeClass(_hover);
			});

		} else {
			$container.on('mouseenter', ''+item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverTimeout')) {
					currentItem.prop('hoverTimeout', clearTimeout(currentItem.prop('hoverTimeout')));
				}

				currentItem.prop('hoverIntent', setTimeout(function () {
					currentItem.addClass(_hover);
					currentItem.next().addClass(_hoverNext);
					currentItem.prev().addClass(_hoverPrev);
				}, 50));

			}).on('mouseleave', ''+ item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverIntent')) {
					currentItem.prop('hoverIntent', clearTimeout(currentItem.prop('hoverIntent')));
				}

				currentItem.prop('hoverTimeout', setTimeout(function () {
					currentItem.removeClass(_hover);
					currentItem.next().removeClass(_hoverNext);
					currentItem.prev().removeClass(_hoverPrev);
				}, 50));

			});

		}
	};

	HoverClass.prototype.removeClassHover = function () {
		var self = this;
		self.$item.removeClass(self.modifiers.hover );
	};

	window.HoverClass = HoverClass;

}(jQuery));
/*jquery.toggleHoverClass end*/

/**
 *! toggle hover class
 * */
function hoverClassInit(){
	if($('.add-menu').length){
		new HoverClass({
			container: '.add-menu',
			item: '.add-menu__item',
			alwaysForTouch: true
		});
	}
}
/*toggle hover class end*/

/**
 * toggle sub navigation
* */
function toggleSubNav() {
	var $mainNav = $('.main-nav'),
		$mainNavItem = $('.main-nav a'),
		$subNav = $('.sub-nav'),
		$currentSubNav,
		$currentItem,
		activeClass = 'sub-nav-opened',
		submenuId,
		timeout,
		delay = 50;

	if ($subNav.length && !Modernizr.touchevents) {

		$mainNav.on('mouseenter', 'a', function () {

			if (window.innerWidth < 768) {
				return;
			}

			$currentItem = $(this);
			submenuId = $currentItem.attr('data-submenu-id');
			$currentSubNav = $('#' + submenuId);

			if (!submenuId) {
				clearTimeout(timeout);

				timeout = setTimeout(function () {
					hideSubNav();
				}, delay);

				return;
			}

			clearTimeout(timeout);

			timeout = setTimeout(function () {
				hideSubNav();
				showSubNav($currentItem, $currentSubNav);
			}, delay);

		}).on('mouseleave', 'a', function () {

			clearTimeout(timeout);

			timeout = setTimeout(function () {
				hideSubNav();
			}, delay);

		});

		$('body').on('mouseenter', '.sub-nav', function () {
			$currentSubNav = $(this);
			submenuId = $currentSubNav.attr('id');

			if (!submenuId) return;

			$currentItem = $mainNav.find('[data-submenu-id=' + submenuId +']');

			clearTimeout(timeout);

			showSubNav($currentItem, $currentSubNav);

		}).on('mouseleave', '.sub-nav', function () {

			clearTimeout(timeout);

			timeout = setTimeout(function () {
				hideSubNav();
			}, delay);

		});

	}

	if (Modernizr.touchevents) {
		$('.btn-subnav-js').on('mousedown touchstart vmousedown', function (e) {
			e.preventDefault();

			$subNav.toggleClass(activeClass);

			e.stopPropagation();
		});

		$subNav.on('mousedown touchstart vmousedown', function (e) {
			e.stopPropagation();
		});

		$(document).on('click', function () {
			$subNav.removeClass(activeClass);
		});

		$('.btn-menu-js, .info-btn-js a').on('mousedown touchstart vmousedown', function () {
			$subNav.removeClass(activeClass);
		});
	}

	function hideSubNav() {
		$mainNavItem.removeClass(activeClass);
		$subNav.removeClass(activeClass);
	}

	function showSubNav(item, nav) {
		item.addClass(activeClass);
		nav.addClass(activeClass);
	}
}
/*toggle sub navigation end*/

/**
 * change sub navigation's state
 * */
function subNavState() {
	var $subNav = $('.sub-nav');

	if ($subNav.length) {
		var $subNavWrap = $('.sub-nav__align');
		var $subNavList = $('.sub-nav__list');
		var modifiers = {
			hasScroll: 'nav-has-scroll',
			isScrolled: 'nav-is-scrolled',
			scrollEnd: 'nav-scroll-end'
		};

		$(window).on('load resize', function () {
			$subNav.toggleClass(modifiers.hasScroll, ($subNavWrap.outerHeight() < $subNavList.outerHeight()));

			setScroll();
			scrollEnd();
		});

		$subNavWrap.on('scroll', function () {
			setScroll();
			scrollEnd();
		});

		function setScroll() {
			$subNav.toggleClass(modifiers.isScrolled, $subNavWrap.scrollTop() > 10);
		}

		function scrollEnd() {
			$subNav.toggleClass(modifiers.scrollEnd, $subNavWrap.scrollTop() >= ($subNavList.outerHeight() - $subNavWrap.outerHeight() - 10));
		}
	}

	// sub nav for mobile (viewport < 480 px)
	if (window.innerWidth < 480 && $subNav.length) {
		getSubNavItemHeight();
	}

	$(window).on('resize', function () {
		if ($subNav.length) {
			getSubNavItemHeight(false);
			if (window.innerWidth < 480) {
				getSubNavItemHeight();
			}
		}
	});

	function getSubNavItemHeight() {
		var heightLayout = window.innerHeight - 109;
		var $subNavItem = $subNavList.find('a');

		if ( arguments[0] === false ) {

			$subNavItem.css('height', 'auto');

			return;
		}

		$.each($subNavItem, function () {
			$(this).css('height', (heightLayout / ($subNavItem.length / 2)).toFixed(0));
		})
	}
}
/*change sub navigation's state end*/

/**
 *! equal height
 * */
function equalHeightInit() {
	var $productsItem = $('.benefits__list');

	if ($productsItem.length) {
		$productsItem.children().matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	}

	var $productsList = $('.products__list');

	if ($productsList.length) {
		$productsList.children().matchHeight({
			byRow: false,
			property: 'height',
			target: null,
			remove: false
		});
	}

	var $cardInfo = $('.card-info');

	if ($cardInfo.length) {
		$cardInfo.children().matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	}

	var $foreignNav = $('.foreign__nav');

	if ($foreignNav.length) {
		$foreignNav.children().matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	}

	var $foreignTitles = $('.foreign__titles');

	if ($foreignTitles.length) {
		$foreignTitles.children().matchHeight({
			byRow: false,
			property: 'height',
			target: null,
			remove: false
		});
	}

	var $foreignPanels = $('.foreign__panels');

	if ($foreignPanels.length) {
		$foreignPanels.children().matchHeight({
			byRow: false,
			property: 'height',
			target: null,
			remove: false
		});
	}
}
/* equal height end */

/**
 *! scroll to section
 * */
function secondNav() {
// external js:
// 1) TweetMax (widgets.js);
// 2) ScrollToPlugin (widgets.js);

	var self = this;
	var scrollArea = ".main";
	var $scrollArea = $(scrollArea);
	var section = 'section[data-side-nav]';
	var $section = $(section);
	var nav = '.side';
	var activeClassForNav = 'active',
		activeClassForSection = 'active-section',
		animateClassForSection = 'animate-section',
		delay = 300,
		bufferZone = 120,
		prevScroll = -1,
		scrollTop = 0,
		sectionIsAnimated = false,
		sectionArr,
		directScrollToTop,
		timeoutSetActive,
		timeoutSetAnimate,
		timeoutPosition;

	self.initialize = function() {
		findNavItems();
		setScroll();
		setActions();
		showSide();
	};

	var tweenScroll = new TimelineLite();

	function scrollToSection(section, duration) {
		if (!section.length || tweenScroll.isActive()) return;

		sectionIsAnimated = true;

		var dur = duration || 0.5;

		prevScroll = scrollTop;

		tweenScroll.to($scrollArea, dur, {scrollTo: {
			y: section.position().top},
			ease: Power2.easeInOut,
			onComplete: function () {
				sectionIsAnimated = false;
			}
		});
	}

	var setActions = function() {
		$(nav).find('ul').on('click', "a", function(e) {
			e.preventDefault();

			var $thisItem = $(this);
			if (sectionIsAnimated || $thisItem.parent().hasClass(activeClassForNav)) return;

			var $activeSection = $($thisItem.attr('href'));

			$('li', nav).removeClass(activeClassForNav);
			$thisItem.parent().addClass(activeClassForNav);

			scrollToSection($activeSection);
		})
	};

	var setScroll = function() {
		var $initialNavItem, $whileSection, $activeSection, $currentSection, $animateSection;

		$initialNavItem = $(nav).find('li').eq(0);

		$currentSection = $($initialNavItem.find('a').attr('href'));
		$activeSection = $whileSection = $currentSection;

		$initialNavItem.addClass(activeClassForNav);
		$currentSection.addClass(activeClassForSection).addClass(animateClassForSection);

		var $nextSection = sectionArr[1];

		$scrollArea.on('scroll', function() {

			if (window.innerWidth < 767) return;

			scrollTop = $scrollArea.scrollTop();

			directScrollToTop = prevScroll > scrollTop;

			var scrollAreaHeight = $scrollArea.outerHeight();

			for (var i = 0; i < sectionArr.length; i++) {
				$currentSection = $(sectionArr[i]);

				var offset = $currentSection.position().top,

					sectionOffset = scrollTop - offset;

				if (
					!directScrollToTop && sectionOffset > -(scrollAreaHeight - bufferZone)
					||
					directScrollToTop && sectionOffset > -(bufferZone - 1)
				) {
					$animateSection = $currentSection;

					/*add animate class*/
					if (window.innerWidth < 992) {
						$animateSection.addClass(animateClassForSection);
					} else {
						clearTimeout(timeoutSetAnimate);

						timeoutSetAnimate = setTimeout(function () {

							$animateSection.addClass(animateClassForSection);

						}, 50);
					}
				}

				if (sectionOffset >= -(scrollAreaHeight/2)) {
					$activeSection = $currentSection;
				}

				if ( sectionOffset > -1 ) {
					$whileSection = $currentSection;
					$nextSection = sectionArr[i + 1];
				}
			}

			/*add active class*/
			timeoutSetActive = setTimeout(function () {

				var $activeSectionId = $activeSection.attr('id');

				$('li', nav).removeClass(activeClassForNav);
				$('li[data-section="' + $activeSectionId + '"]', nav).addClass(activeClassForNav);

				$section.removeClass(activeClassForSection);
				$activeSection.addClass(activeClassForSection);

			}, 250);

			/*scroll position correction*/
			if (DESKTOP && !document.documentMode && window.innerWidth > 992) {
				// if not device, if not ie all versions, if viewport more then 992 px
				clearTimeout(timeoutPosition);

				if ($nextSection) {

					timeoutPosition = setTimeout(function () {

						var offsetWhile = $whileSection.position().top;
						var offsetNext = $nextSection.position().top;
						var whileSectionHeight = $whileSection.outerHeight();

						if (offsetWhile !== scrollTop && (offsetWhile + bufferZone) > scrollTop && whileSectionHeight <= scrollAreaHeight) {

							// console.log("------------ while (1) ------------");
							scrollToSection($whileSection);

							return false;
						}

						if ((offsetWhile + whileSectionHeight - bufferZone) <= scrollTop) {

							// console.log("------------ next (1) -----------");
							scrollToSection($nextSection);

							return false;
						}

						if (!directScrollToTop && (offsetNext + bufferZone) < (scrollTop + scrollAreaHeight)) {

							// console.log("------------ next (2) -----------");
							scrollToSection($nextSection);

							return false;
						}

						if (directScrollToTop && (offsetNext + bufferZone) < (scrollTop + scrollAreaHeight) && whileSectionHeight <= scrollAreaHeight) {

							// console.log("------------ while (2) ------------");
							scrollToSection($whileSection);

							return false;
						}

						// console.log("------------ no move ------------");

					}, delay);

				}
			}

			prevScroll = scrollTop;
		});
	};

	var findNavItems = function() {
		sectionArr = [];

		$section.each(function() {
			var $this = $(this);

			if ($this.attr("data-side-nav")) {
				sectionArr.push($this)
			}
		});

		createNavigation()
	};

	var showSide = function () {
		var showSideClass = 'show-side';
		var $html = $('html');

		$('.btn-side').on('click', function (e) {
			e.stopPropagation();

			$html.toggleClass(showSideClass, !$html.hasClass(showSideClass));

			e.preventDefault();
		});

		$('.side').on('click', function (e) {
			e.stopPropagation();
		});

		$(document).on('click', function () {
			$html.removeClass(showSideClass);
		});
	};

	var createNavigation = function() {
		var navTpl = '<nav class="side"><a class="btn-side"><i></i></a><ul></ul></nav>';

		$('body').append(navTpl);

		for (var i = 0; i < sectionArr.length; i++) {
			$(nav).find("ul")
				.append(
					'<li data-section="' + $(sectionArr[i]).attr("id") + '">' +
					'<a href="#' + $(sectionArr[i]).attr("id") + '">' +
					'<i class="side__circle"></i>' +
					'<span class="side__label">' + $(sectionArr[i]).data("side-nav") + '</span>' +
					'</a>' +
					'</li>'
				)
		}
	};

	self.initialize()
}

var secondaryNav;
/*scroll to section end*/

/**
 *! history
 * */
(function ($) {
	var HistorySlider = function (settings) {
		var options = $.extend({
			section: null,
			switcher: null,
			switcherPanel: null,
			switcherNavItem: null,
			switcherNavAnchor: null,
			bgImg: null,
			photosSlider: null,
			showPhotosBtn: null,
			activeSwitcher: null,
			animationSpeed: 0.3
		}, settings || {});

		var self = this;

		self.options = options;
		self.$section = $(options.section);
		self.$switcher = $(options.switcher);
		self.switcherPanel = options.switcherPanel;
		self.$switcherNavItem = $(options.switcherNavItem);
		self.$switcherNavAnchor = $(options.switcherNavAnchor);
		self.$bgImg = $(options.bgImg);
		self.$photosSlider = $(options.photosSlider);
		self.$showPhotosBtn= $(options.showPhotosBtn);
		self.btnIsVisible = true;
		self.bgImgShow = false;

		self.activeSwitcher = options.activeSwitcher;
		self.animationSpeed = options.animationSpeed;

		self.modifiers = {
			active: 'active',
			activePrev: 'active-prev',
			activeNext: 'active-next',
			showPhoto: 'show-photo'
		};

		self.currentSwitcher = options.activeSwitcher;

		self.getImagesSlider = self.imagesSliderInit();

		self.preparationAnimation();
		self.initSwitcher();
		self.toggleSwitcher();
		self.toggleImageView();
		self.hideImgView();
		self.periodsSliderInit();
		self.periodsFixed();
	};

	HistorySlider.prototype.initSwitcher = function() {
		var self = this;

		if(self.options.photosSlider) {
			self.countSlides();
		}
		self.switchClass();
		self.toggleContent();
		self.changeHeightContainer();
		self.toggleActivePhoto();
	};

	// toggle content
	HistorySlider.prototype.toggleSwitcher = function() {
		var self = this;

		$(document).on('click', ''+ this.options.switcherNavAnchor +'', function (e) {
			e.preventDefault();
			var initIndex = self.currentSwitcher;

			var $curAnchor = $(this),
				thisIndex = $curAnchor.closest(self.$switcherNavItem).index();

			if (initIndex === null && thisIndex === initIndex) {

				toggleActiveClass();
				toggleContent(false);
				changeHeightContainer(false);

				return;
			}

			if (thisIndex === initIndex) return false;

			self.currentSwitcher = thisIndex;

			self.initSwitcher();
			
			self.togglePhotoShowClass(false);

			if (DESKTOP) {
				setTimeout(function () {
					self.scrollToSection();
				}, 100)
			}
		});

	};

	// preparation element before animation
	HistorySlider.prototype.preparationAnimation = function() {
		var self = this;

		var $content = self.$switcher;

		$content.css({
			'display': 'block',
			'position': 'relative'
		});

		var $curPanels = $(self.switcherPanel, $content);

		$curPanels.css({
			'display': 'block',
			'position': 'absolute',
			'left': 0,
			'right': 0,
			'top': 0,
			'width': '100%',
			'z-index': -1
		});
	};

	HistorySlider.prototype.switchClass = function() {
		var self = this;
		var $content = self.$switcher;

		var initIndex = self.currentSwitcher,
			indexNext = 0,
			indexPrev = 0;

		var activeClass = self.modifiers.active,
			activeClassPrev = self.modifiers.activePrev,
			activeClassNext = self.modifiers.activeNext;

		var panel = this.switcherPanel;
		var panelsArr = [];

		panelsArr.push($(panel), self.$switcherNavItem);

		$.each(panelsArr, function () {
			var $curItems = $(this, $content);
			var length = $curItems.length;

			indexNext = (initIndex < length - 1) ? initIndex + 1 : 0;
			indexPrev = (initIndex >= 0) ? initIndex - 1 : length - 1;

			$curItems
				.eq(initIndex).addClass(activeClass)
				.siblings().removeClass(activeClass);

			$curItems
				.eq(indexNext).addClass(activeClassNext)
				.siblings().removeClass(activeClassNext);

			$curItems
				.eq(indexPrev).addClass(activeClassPrev)
				.siblings().removeClass(activeClassPrev);
		});
	};

	// show active content and hide other
	HistorySlider.prototype.toggleContent = function() {

		var self = this;

		var $content = self.$switcher,
			$panel = self.switcherPanel,
			animationSpeed = self.animationSpeed;

		var $curPanel = $($panel, $content);
		var $currentPanel = $curPanel.eq(self.currentSwitcher);

		$content.css('height', $content.outerHeight());

		$curPanel.css({
			'position': 'absolute',
			'left': 0,
			'right': 0
		});

		TweenMax.set($curPanel, {
			autoAlpha: 0,
			'z-index': -1
		});

		if ( arguments[0] === false ) return;

		$currentPanel.css('z-index', 2);

		TweenMax.to($currentPanel, animationSpeed, {
			autoAlpha: 1
		});
	};

	// change container's height
	HistorySlider.prototype.changeHeightContainer = function() {
		var self = this;

		var $content = self.$switcher,
			$panel = self.switcherPanel,
			initIndex = self.currentSwitcher,
			animationSpeed = self.animationSpeed;

		var $curPanel = $($panel, $content);
		var $activePanels = $curPanel.eq(initIndex);
		var $activeContainer = $activePanels.closest($content);

		if ( arguments[0] === false ) {
			TweenMax.to($activeContainer, animationSpeed, {
				'height': 0
			});

			return;
		}

		TweenMax.to($activeContainer, 0.1, {
			'height': $activePanels.outerHeight(),

			onComplete: function () {

				$content.css('height', 'auto');

				$activePanels.css({
					'position': 'relative',
					'left': 'auto',
					'right': 'auto',
					'top': 'auto'
				});
			}
		});
	};

	/*images view toggle*/
	HistorySlider.prototype.imagesSliderInit = function() {
		var self = this;
		var $photosSlider = self.$photosSlider;

		if ($photosSlider.length) {

			var slidersArr = [];

			$.each($(self.switcherPanel, self.$switcher), function () {
				var $currentImagesSlider = $(this).find($photosSlider);

				if ($currentImagesSlider.length === 0) {
					slidersArr.push(undefined);

					return;
				}

				var historyImageSlider = $currentImagesSlider.slick({
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					speed: 300,
					// autoplay: true,
					// autoplaySpeed: 8000,
					dots: false,
					arrows: true,
					responsive: [
						{
							breakpoint: 640,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});

				slidersArr.push(historyImageSlider);

			});

			return slidersArr;
		}
	};

	HistorySlider.prototype.countSlides = function () {
		/*html*/
		//<a href="#" class="show-photos-js"><span class="photos-count">0</span></a>

		var self = this;

		var currentImagesSlider = self.getImagesSlider[self.currentSwitcher];
		var $currentShowPhotosBtn = self.$showPhotosBtn;

		if (currentImagesSlider === undefined) {
			TweenMax.to($currentShowPhotosBtn, self.animationSpeed, {
				autoAlpha: 0
			});

			self.btnIsVisible = false;

			return;
		}

		if (!self.btnIsVisible) {
			TweenMax.to($currentShowPhotosBtn, self.animationSpeed, {
				autoAlpha: 1
			});
		}

		var totalSlides = currentImagesSlider.slick('getSlick').$slides.length;

		$('.photos-count', $currentShowPhotosBtn).text(totalSlides);
	};

	HistorySlider.prototype.togglePhotoShowClass = function () {
		var self = this;
		var $section = self.$section;
		var $bgImg = self.$bgImg;
		var showPhotoClass = self.modifiers.showPhoto;


		if (self.bgImgShow || arguments[0] === false) {
			self.bgImgShow = false;

			$section.removeClass(showPhotoClass);
			$bgImg.removeClass(showPhotoClass);
		} else {
			self.bgImgShow = true;

			$section.addClass(showPhotoClass);
			$bgImg.eq(self.currentSwitcher).addClass(showPhotoClass);
		}
	};

	HistorySlider.prototype.toggleActivePhoto = function () {
		var self = this;
		var $bgImg = self.$bgImg;
		var activeClass = self.modifiers.active;

		$bgImg.removeClass(activeClass);
		$bgImg.eq(self.currentSwitcher).addClass(activeClass);
	};

	HistorySlider.prototype.toggleImageView = function () {
		var self = this;

		self.$showPhotosBtn.on('mousedown touchstart vmousedown', function (e) {
			e.preventDefault();

			if (self.options.bgImg) {
				self.togglePhotoShowClass();
			}

			if (self.options.photosSlider) {
				var $currentImageSlider = self.getImagesSlider[self.currentSwitcher];

				if ($currentImageSlider.height() === 0) {

					TweenMax.set($currentImageSlider, {yPercent: 100});

					TweenMax.to($currentImageSlider, 0.1, {
						'height': $currentImageSlider.find('img').outerHeight(),
						autoAlpha: 1,
						onComplete: function () {
							TweenMax.to($currentImageSlider, self.animationSpeed, { yPercent: 0});
						}
					});

				} else {

					TweenMax.to($currentImageSlider, self.animationSpeed, {
						yPercent: 100,
						onComplete: function () {
							TweenMax.to($currentImageSlider, 0.1, {
								'height': 0,
								autoAlpha: 0
							});
						}
					});

				}
			}

		})
	};

	HistorySlider.prototype.hideImgView = function () {
		var self = this;

		self.$bgImg.on('mousedown touchstart vmousedown', function (e) {
			e.preventDefault();

			if (self.options.bgImg && self.bgImgShow) {
				self.togglePhotoShowClass();
			}

		})
	};
	/*images view toggle end*/

	/*init history periods slider*/
	HistorySlider.prototype.periodsSliderInit = function () {
		var self = this;

		var options = {
			itemNav: 'forceCentered',
			horizontal: 1,
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 0,
			scrollBy: 0,
			speed: 300,
			elasticBounds: 1,
			easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			activeClass: 'current-slide',

		};
		var sly = new Sly($('.history-periods-wrap'), options, {
			load: function () {
				$(this.slidee).addClass('sly-init');
			}
		}).init();

		if(window.innerWidth > 991) {
			sly.destroy();
		}

		$(window).on('debouncedresize', function() {

			if (window.innerWidth < 992 && !$(sly.slidee).hasClass('sly-init')) {

				$(sly.slidee).addClass('sly-init');
				sly.destroy().init();
				sly.activate(self.currentSwitcher);

			}

			if (window.innerWidth > 991 && $(sly.slidee).hasClass('sly-init')) {

				$(sly.slidee).removeClass('sly-init');
				sly.destroy();

			}

			if ($(sly.slidee).hasClass('sly-init')) {
				sly.reload();
			}
		});
	};

	HistorySlider.prototype.periodsFixed = function () {
		$('.main').on('scroll', function () {
			var scrollTopPosition = $(this).scrollTop();
			var $activeBlock = $('.section-history');
			var offsetStart = $activeBlock.position().top;
			var $activeNav = $('.section-aside__history');
			var offsetEnd = offsetStart + $activeBlock.outerHeight() - $activeNav.outerHeight();

			$activeBlock.toggleClass('fixed-history-periods', scrollTopPosition > offsetStart);
			$activeBlock.toggleClass('hide-history-periods', scrollTopPosition > offsetEnd);
		})
	};

	HistorySlider.prototype.scrollToSection = function () {
		var $scrollArea = $('.main');

		if (!$scrollArea.is(':animated')) {
			var $currentSection = $('.section-history');

			TweenMax.to($scrollArea, 0.3, {scrollTo: {
				y: $currentSection.position().top},
				ease: Power2.easeInOut
			});
		}
	};

	window.HistorySlider = HistorySlider;

}(jQuery));

function historySwitcher(){
	if($('.history-sliders-js').length){

		new HistorySlider({
			section: '.section-history',
			switcher: '.history-sliders-js',
			switcherPanel: '.history-slider__item',
			switcherNavItem: '.history-periods li',
			switcherNavAnchor: '.history-periods a',
			bgImg: '.history-slider-bg > div',
			showPhotosBtn: '.show-photos-js',
			activeSwitcher: 0
		});
	}
}
/*history end*/

/**
 * tab switcher
 * */
function tabSwitcher() {
	// external js:
	// 1) TweetMax VERSION: 1.19.0 (widgets.js);
	// 2) resizeByWidth (resize only width);

	/*
	 <!--html-->
	 <div class="some-class js-tabs" data-collapsed="true">
	 <!--if has data-collapsed="true" one click open tab content, two click close collapse tab content-->
	 <div class="some-class__nav">
	 <div class="some-class__tab">
	 <a href="#" class="js-tab-anchor" data-for="some-id-01">Text tab 01</a>
	 </div>
	 <div class="some-class__tab">
	 <a href="#" class="js-tab-anchor" data-for="some-id-02">Text tab 02</a>
	 </div>
	 </div>

	 <div class="some-class__panels js-tab-container">
	 <div class="some-class__panel js-tab-content" data-id="some-id-01">Text content 01</div>
	 <div class="some-class__panel js-tab-content" data-id="some-id-02">Text content 02</div>
	 </div>
	 </div>
	 <!--html end-->
	 */

	var $main = $('.foreign-js');

	var $container = $('.foreign__panels-js');

	if ( !$container.length ) return false;

	if($main.length){
		var $anchor = $('.foreign__anchor-js'),
			$content = $('.foreign__panel-js'),
			activeClass = 'active',
			animationSpeed = 0.2,
			animationHeightSpeed = 0;

		$.each($main, function () {
			var $this = $(this),
				$thisAnchor = $this.find($anchor),
				$thisContainer = $this.find($container),
				$thisContent = $this.find($content),
				initialDataAtr = $this.find('.active').data('for'),
				activeDataAtr = false;

			// prepare traffic content
			function prepareTrafficContent() {
				$thisContainer.css({
					'position': 'relative',
					'overflow': 'hidden'
				});

				$thisContent.css({
					'display': 'block',
					'position': 'absolute',
					'left': 0,
					'right': 0,
					'top': 0,
					'width': '100%',
					'z-index': -1
				});

				switchContent();
			}

			prepareTrafficContent();

			// toggle content
			$thisAnchor.on('click', function (e) {
				e.preventDefault();

				var $cur = $(this),
					dataFor = $cur.data('for');

				if ($this.data('collapsed') === true && activeDataAtr === dataFor) {

					toggleActiveClass();
					toggleContent(false);
					changeHeightContainer(false);

					return;
				}

				if (activeDataAtr === dataFor) return false;

				initialDataAtr = dataFor;

				switchContent();
			});

			// switch content
			function switchContent() {
				if (initialDataAtr) {
					toggleContent();
					changeHeightContainer();
					toggleActiveClass();

				}
			}

			// show active content and hide other
			function toggleContent() {

				$.each($thisContainer, function () {
					var $currentContainer = $(this);
					$currentContainer.css('height', $currentContainer.outerHeight());

					var $currentContent = $currentContainer.find($thisContent);

					$currentContent.css({
						'position': 'absolute',
						'left': 0,
						'right': 0,
						'top': 0
					});

					TweenMax.set($currentContent, {
						autoAlpha: 0,
						'z-index': -1
					});

					if ( arguments[0] === false ) return;

					var $initialContent = $currentContent.filter('[data-id="' + initialDataAtr + '"]');

					$initialContent.css('z-index', 2);

					TweenMax.to($initialContent, animationSpeed, {
						autoAlpha: 1
					});
				});
			}

			// change container's height
			function changeHeightContainer() {
				var $initialContent = $thisContent.filter('[data-id="' + initialDataAtr + '"]');

				$.each($initialContent, function () {
					var $currentContent = $(this);
					var $currentContainer = $currentContent.closest($thisContainer);

					if ( arguments[0] === false ) {
						TweenMax.to($currentContainer, animationHeightSpeed, {
							'height': 0
						});

						return;
					}

					TweenMax.to($currentContainer, animationHeightSpeed, {
						'height': $currentContent.outerHeight(),
						onComplete: function () {

							$currentContainer.css('height', 'auto');

							$currentContent.css({
								'position': 'relative',
								'left': 'auto',
								'right': 'auto',
								'top': 'auto'
							});
						}
					});
				});
			}

			// toggle class active
			function toggleActiveClass(){
				$thisAnchor.removeClass(activeClass);
				$thisContent.removeClass(activeClass);

				// toggleStateThumb();

				if (initialDataAtr !== activeDataAtr) {

					activeDataAtr = initialDataAtr;

					$thisAnchor.filter('[data-for="' + initialDataAtr + '"]').addClass(activeClass);
					$thisContent.filter('[data-id="' + initialDataAtr + '"]').addClass(activeClass);

					return false;
				}

				activeDataAtr = false;
			}
		});
	}
}
/* tab switcher end */

/**
 * create bottom spacer
 * */
function createBottomSpacer(target) {
	var $sliderSpacer = $('<div />', {
		class: 'section-bottom-spacer'
	});

	$(target).before($sliderSpacer.clone());
}

function spacerGetHeight(spacer, sample) {
	$(spacer).height(sample.outerHeight());
}

function addBottomSpacer() {
	var $brief = $('.brief');
	if ($brief.length) {
		createBottomSpacer($brief);
		$(window).on('load resizeByWidth', function () {
			spacerGetHeight($brief.parent().find('.section-bottom-spacer'), $brief);
		})
	}
}
/*create bottom spacer end*/

/**
 * images gallery
 * */
function imagesGalleryInit() {
	var $imagesGallery = $('.images-gallery');

	if ($imagesGallery.length) {
		// createBottomSpacer($imagesGallery);

		$('.images-gallery__list', $imagesGallery).on('init', function (event, slick) {
			// setTimeout(function () {
			// 	spacerGetHeight($imagesGallery.parent().find('.section-bottom-spacer'), $imagesGallery);
			// }, 200)
		}).slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			centerMode: true,
			variableWidth: true,
			infinite: true,
			speed: 300,
			lazyLoad: 'ondemand',
			// autoplay: true,
			// autoplaySpeed: 8000,
			dots: false,
			arrows: true,
			// initialSlide: 0,
			responsive: [
				{
					breakpoint: 1920,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4
					}
				},
				{
					breakpoint: 1550,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 1270,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 990,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				}
			]
		});

		$('body').on('click', '.images-gallery__item a', function (e) {
			e.preventDefault();

			$('.images-gallery__list', $imagesGallery).slick('slickGoTo', $(this).parent().attr('data-slick-index'));
		})
	}
}
/*images gallery end*/

/**
 * news slider
 * */
function newsSliderInit() {
	var $defaultSlider = $('.news-slider');

	if ($defaultSlider.length) {
		$('.news-slider__list', $defaultSlider).each(function () {
			var $currentSlider = $(this);
			var $wrapperSlider = $currentSlider.parent();

			var $currentSlide = $wrapperSlider.find('.slide__curr'),
				$totalSlides = $wrapperSlider.find('.slide__total');

			$currentSlider.on('init', function (event, slick) {
				$totalSlides.text(slick.$slides.length);
				$currentSlide.text(slick.currentSlide + 1);
			}).slick({
				fade: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				// autoplay: true,
				// autoplaySpeed: 6000,
				// adaptiveHeight: true,
				infinite: true,
				speed: 500,
				dots: true,
				arrows: true,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							fade: false,
							dots: false
						}
					}
				]
			}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
				$currentSlide.text(nextSlide + 1);
			});
		});
	}
}
/*news slider end*/

/**
 * modal window
 * */
function modalWindowInit() {
	var modalIsOpen = false;
	var $body = $('body');

	// modal video
	$('.modal-video').on('click', function() {
		var href = $(this).attr('href');
		var data = '<div class="modal"><div class="modal__overlay"></div><div class="modal__wrap"><div class="modal__align"><div class="modal__container modal__container__video"><div class="modal__video__wrap"><iframe src="' + href + '" frameborder="0" allowfullscreen></iframe></div></div></div><a class="modal__close"><span>Close</span></a></div></div>';

		$body.addClass('body--no-scroll');
		$body.append(data);
		modalIsOpen = true;
		$('.modal').addClass('modal--video').show(0, function() {
			$('.modal').addClass('modal--active');
		});

		return false;
	});

	function showImgModal() {
		var $this = $(this);
		var src = $this.attr('href') || $this.attr('data-img-zoom');
		var alt = $this.find('img').attr('alt') || $this.attr('alt');
		var data = '<div class="modal"><div class="modal__overlay"></div><div class="modal__wrap"><div class="modal__align"><div class="modal__container"><div class="modal__img__wrap"><img src="' + src + '" alt="' + alt + '" /></div></div></div><a class="modal__close"><span>Close</span></a></div></div>';

		$body.addClass('body--no-scroll');
		$body.append(data);
		modalIsOpen = true;
		$('.modal').addClass('modal--img').show(0, function () {
			$('.modal').addClass('modal--active');
		});

		return false;
	}

	// modal img
	$body.on('click', '.modal-img', function() {
		return showImgModal.call(this);
	});

	// modal img in slider
	$body.on('click', '.images-gallery .slick-current a', function() {
		return showImgModal.call(this);
	});

	// modal close on click to btn close
	$body.on('click', '.modal__close, .modal__wrap', function() {
		closeModalWindow();
	});

	// modal close on click to "Esc" key
	$(document).keyup(function(e) {
		if (modalIsOpen && e.keyCode == 27) {
			closeModalWindow();
		}
	});

	// close modal window
	function closeModalWindow() {
		$('.modal').removeClass('modal--active');
		setTimeout(function () {
			$('.modal').remove();
			$('body').removeClass('body--no-scroll');
		}, 500);
	}

	// modal no close
	$body.on('click', '.modal__video__wrap', function(e) {
		e.stopPropagation();
	});
}
/*modal window end*/

/**
 * up z-index
 * */
function upZindex() {
	var $briefInner = $('.brief__inner');
	$briefInner.on('mouseenter', function () {
		$briefInner.parent().removeClass('zindex-up');
		$(this).parent().addClass('zindex-up');
	})
}
/* up z-index end */

/**
 * image lazy load
 * */
function imgLazyLoad() {
	var $productsImg = $('.products__img');

	if ($productsImg.length) {
		$productsImg.find('img').unveil();
	}

	var $cardImages = $('.card-figure');

	if ($cardImages.length) {
		$cardImages.find('img').unveil();
	}
}
/*image lazy load end*/

/**
 * filer products
 * */
function filtersProducts() {
	// external js:
	// 1) isotope.pkgd.js (widgets.js)
	// 2) imagesLoaded PACKAGED v4.1.1 (widgets.js)
	// 3) jQuery Unveil (widgets.js)

	// var $grid = $('.products__list').isotope({
	// 	// options
	// 	itemSelector: '.products__item',
	// 	layoutMode: 'fitRows',
	// 	stagger: 10,
	// 	transitionDuration: 400,
	// 	hiddenStyle: {
	// 		opacity: 0,
	// 		// transform: 'scale(0.001)'
	// 		transform: 'scale(1)'
	// 	},
	// 	visibleStyle: {
	// 		opacity: 1,
	// 		transform: 'scale(1)'
	// 	}
	// });

	// // bind filter button click
	// $('.filter-js').on( 'click', 'a', function() {
	// 	var filterValue = $( this ).attr('data-filter');
	// 	$grid.isotope({ filter: filterValue });
	// });
	//
	// // change is-checked class on buttons
	// $('.filter-js').on( 'click', 'a', function() {
	// 	$( '.filter-js a' ).removeClass('selected');
	// 	$( this ).addClass('selected');
	// });

	if (!$('.products-filter').length) return;

	function getHashFilter() {
		// get filter=filterName
		var matches = location.hash.match( /filter=([^&]+)/i );
		var hashFilter = matches && matches[1];
		return hashFilter && decodeURIComponent( hashFilter );
	}

	// init Isotope
	var $grid = $('.products__list');

	// bind filter button click
	var $filterButtonGroup = $('.filter-js');
	$filterButtonGroup.on( 'click', 'a', function(e) {
		e.preventDefault();

		var filterAttr = $( this ).attr('data-filter');
		// set filter in hash
		location.hash = 'filter=' + encodeURIComponent( filterAttr );
	});

	var isIsotopeInit = false;

	function onHashchange() {
		var hashFilter = getHashFilter();
		if ( !hashFilter && isIsotopeInit ) {
			return;
		}
		isIsotopeInit = true;
		// filter isotope
		$grid.isotope({
			itemSelector: '.products__item',
			layoutMode: 'fitRows',
			stagger: 10,
			percentPosition: true,
			transitionDuration: 400,
			hiddenStyle: {
				opacity: 0,
				// transform: 'scale(0.001)'
				transform: 'scale(1)'
			},
			visibleStyle: {
				opacity: 1,
				transform: 'scale(1)'
			},
			// use filterFns
			filter: hashFilter
		});

		// set selected class on button
		if ( hashFilter ) {
			$filterButtonGroup.find('a').removeClass('selected');
			$filterButtonGroup.find('[data-filter="' + hashFilter + '"]').addClass('selected');
		}
	}

	// layout Isotope after each image loads
	$grid.imagesLoaded().progress( function() {
		$grid.isotope('layout');
	});

	$grid.on( 'arrangeComplete', function() {
		$('.main').trigger('changeSize'); // triggered function of change size the container for reinit events load images ( jQuery Unveil (widgets.js))
	});

	$(window).on( 'hashchange', onHashchange );

	// trigger event handler to init Isotope
	onHashchange();
}
/*filters products end*/

/**
 * toggle info
 * */
function toggleInfo() {
	var $body = $('body');
	var infoContainer = '.info-js';
	var $infoContainer = $(infoContainer);
	var fullInfoClass = 'full-info';
	var scrollTop = 0;
	var scrollSpace = 30;

	$body.on('click', '.more-info-js', function (e) {
		e.preventDefault();

		if ($(window).innerWidth() < 1200) {
			var elementHeight = Math.max.apply(Math,$('.card-feature__short .card-caption__title').map(function(){return $(this).outerHeight(true);}).get());

			TweenMax.to($('.main'), 0.6, {scrollTo: {
				y: $(window).height() - elementHeight},
				ease: Power2.easeInOut
			});

			return;
		}

		$(this).closest(infoContainer).addClass(fullInfoClass);
	});

	$body.on('click', '.short-info-js', function (e) {
		e.preventDefault();

		$(this).closest(infoContainer).removeClass(fullInfoClass);
	});

	$('.main').on('scroll', function () {
		if ($(window).innerWidth() < 1200) {
			scrollTop = $(this).scrollTop();
			if (scrollTop > scrollSpace) {
				$infoContainer.addClass(fullInfoClass);
			} else {
				$infoContainer.removeClass(fullInfoClass);
			}
		}
	})
}
/*toggle info end*/

/**
 * behaviors card product elements
 * */
function behaviorCardProductsElements() {
	var viewport = 1200;

	if (DESKTOP && window.innerWidth < viewport) {
		opacityImage();
		fixedTitle();
	}

	$('.main').on('scroll', function () {
		if (DESKTOP && window.innerWidth < viewport) {
			opacityImage();
			fixedTitle();
		}
	});

	if ($('.card').length ) {
		$('.ms-js').on('showedPrevSliderItem showedNextSliderItem', function () {
			if (window.innerWidth < viewport && $('.info-js').hasClass('full-info')) {
				if (DESKTOP) {
					var elementHeight = Math.max.apply(Math, $('.card-feature__short .card-caption__title').map(function () {
						return $(this).outerHeight(true);
					}).get());

					TweenMax.to($('.main'), 0.6, {
						scrollTo: {
							y: $(window).height() - elementHeight
						}, ease: Power2.easeInOut
					});
				} else {
					TweenMax.to($('.main'), 0.6, {
						scrollTo: {
							y: 0
						}, ease: Power2.easeInOut
					});
				}
			}
		})
	}

	$(window).on('resize', function () {
		if (window.innerWidth >= viewport) {

			if ($('.card-figure')) {
				TweenMax.set('.card-figure', {
					scale: 1, autoAlpha: 1
				});
			}

			if ($('.card-caption__title')) {
				TweenMax.set('.card-feature__short .card-caption__title', {
					y: 0, autoAlpha: 1
				});
			}

		}
	});

	function opacityImage() {
		var element = '.card-figure';

		if (!$(element).length) return;

		var alpha, scale;

		var scrollTop = $('.main').scrollTop();
		var windowHeight = $(window).height();

		var alphaValue = (1 - ( scrollTop/windowHeight) ).toFixed(5);
		var scaleValue = (1 - ( scrollTop * 0.3/windowHeight)).toFixed(5);

		alpha = (alphaValue > 0.3) ? alphaValue : 0.3;
		scale = (scaleValue > 0.8) ? scaleValue : 0.8;

		TweenMax.to(element, 0, {
			scale: scale,
			opacity: alpha
		});
	}

	function fixedTitle() {
		var element = '.card-feature__short .card-caption__title';

		if (!$(element).length) return;

		var offset = $(element).parent().offset().top;
		var alpha, translateY;

		var elementHeight = Math.max.apply(Math, $(element).map(function () {
			return $(this).outerHeight(true);
		}).get());

		var scrollTop = $('.main').scrollTop();
		var windowHeight = $(window).height();

		if (offset > 0) {

			TweenMax.set(element, {
				top: 'auto'
			});

			TweenMax.to(element, 0, {
				y: -scrollTop
			});

		} else {

			TweenMax.set(element, {
				top: 0, y: 0
			});

		}

		if ((windowHeight - scrollTop) < elementHeight) {

			var deltaAlpha = (windowHeight - scrollTop) / elementHeight;
			var deltaTranslateY = (elementHeight - (windowHeight - scrollTop));

			alpha = (deltaAlpha > 0) ? deltaAlpha : 0;
			translateY = ((windowHeight - scrollTop) > 0) ? deltaTranslateY : elementHeight;

			TweenMax.to(element, 0, {
				y: -translateY, autoAlpha: alpha
			});

		} else {
			TweenMax.to(element, 0.2, {
				autoAlpha: 1
			});
		}
	}
}
/*behaviors card product elements end*/

/**
 *!  ready/load/resize document
 * */

jQuery(document).ready(function(){
	placeholderInit();
	if (!Modernizr.touchevents) {
		customSelect($('select.cselect'));
	}
	printShow();
	mainSlider();
	classToggle();
	parallaxMainSlider();
	hoverClassInit();
	toggleSubNav();
	subNavState();
	equalHeightInit();
	historySwitcher();
	tabSwitcher();
	addBottomSpacer();
	imagesGalleryInit();
	newsSliderInit();
	modalWindowInit();
	upZindex();
	imgLazyLoad();
	filtersProducts();
	toggleInfo();
	behaviorCardProductsElements();

	if ($('.main').hasClass('about')) {
		secondaryNav = new secondNav();
	}
});