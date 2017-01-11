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
	var delta = 30;
	var img = '.main-slider-img';

	if (document.querySelector(img)) {
		new ParallaxJs({
			parallaxElement: img,
			parallaxArea: '.wrapper',
			parallaxDelta: delta
		});
	}

	var caption = '.main-slider-caption__holder';

	if (document.querySelector(caption)) {
		new ParallaxJs({
			parallaxElement: '.main-slider-caption__holder',
			parallaxArea: '.wrapper',
			parallaxDelta: delta
		});
	}

	var desk = '.main-slider-desks';

	if (document.querySelector(desk)) {
		new ParallaxJs({
			parallaxElement: desk,
			parallaxArea: '.wrapper',
			parallaxDelta: delta
		});
	}

	var bg = '.main-slider-bg';

	if (document.querySelector(bg)) {
		new ParallaxJs({
			parallaxElement: bg,
			parallaxArea: '.wrapper',
			parallaxDelta: delta + 30
		});
	}
}
/**
 * parallax on mousemove end
 * */

/**
 *! main slider
 * */
function mainSlider() {
	'use strict';

	var $container = $('.ms-js');
	if (!$container.length) return false;

	var activeClass = 'active',
		activeClassPrev = 'active-prev',
		activeClassNext = 'active-next',
		hideClass = 'hide',
		index = 0,
		indexNext, indexPrev;

	var images = '.ms-img-js';

	var $tab = [
		images,
		'.ms-bg-js',
		'.ms-desks-js',
		'.main-slider-title-js'
		// '.ms-dots-js button'
	];

	$.each($container, function () {
		var currentSlider = $(this);

		var currentSlideIndex = index;
		var totalLength = $(images, currentSlider).length;

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

		var $currentSlider = $currentBtn.closest($container);
		index = $currentBtn.index();

		// switchStateTab($currentSlider,$tab);
		switchStateTab($currentSlider,$tab,index);

		return index;
	});

	$('.ms-arrow-js').on('click', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);
		var $currentSlider = $currentBtn.closest($container);
		var length = $currentBtn.closest($container).find(images).length;

		if ($currentBtn.data('direction') === "prev") {
			if (index <= 0) {
				index = index - 1 + length;
			} else {
				index = index - 1;
			}
		} else {
			if (index >= length - 1) {
				index = index + 1 - length;
			} else {
				index = index + 1;
			}
		}

		// switchStateTab($currentSlider,$tab);
		switchStateTab($currentSlider,$tab,index);
		
		slidesCounter($currentSlider,index,length);

		return index;
	});

	$($container).swipe({
		swipeRight: function (e) {
			var $currentSlider = $(this);
			var length = $currentSlider.find(images).length;

			if (index <= 0) {
				index = index - 1 + length;
			} else {
				index = index - 1;
			}

			switchStateTab($currentSlider,$tab,index);

			slidesCounter($currentSlider,index,length);

			return index;
		},
		swipeLeft: function (e) {
			var $currentSlider = $(this);
			var length = $currentSlider.find(images).length;

			if (index >= length - 1) {
				index = index + 1 - length;
			} else {
				index = index + 1;
			}

			switchStateTab($currentSlider,$tab,index);

			slidesCounter($currentSlider,index,length);

			return index;
		}
	});

	function switchStateTab(content,tab,index) {
		var length = content.find(images).length;

		// if property "index" length class added
		// else class removed
		if (Array.isArray(tab)){
			for(var i = 0; i < tab.length; i++) {

				indexNext = (index < length - 1) ? index + 1 : 0;
				indexPrev = (index >= 0) ? index - 1 : length - 1;

				content.find(tab[i])
					.eq(index).addClass(activeClass)
					.siblings().removeClass(activeClass);

				content.find(tab[i])
					.eq(indexNext).addClass(activeClassNext)
					.siblings().removeClass(activeClassNext);

				content.find(tab[i])
					.eq(indexPrev).addClass(activeClassPrev)
					.siblings().removeClass(activeClassPrev);
			}
		} else {
			content.find(tab)
				.eq(index).addClass(activeClass)
				.siblings().removeClass(activeClass);
		}
	}

	function slidesCounter(slider, currentSlideIndex, totalLength) {
		$('.ms-current-slide-js', slider).text(currentSlideIndex + 1);
		$('.ms-total-js', slider).text(totalLength);
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
	$html.on('click', '.info-btn-js a', function (e) {
		if ($('.info-bar-js').length) {
			e.preventDefault();

			$html.removeClass(activeClassSidebar);
			$html.toggleClass(activeClassInfoBar, !$html.hasClass(activeClassInfoBar));
		}
	});

	// sidebar toggle
	$html.on('click', '.btn-menu-js', function (e) {
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
	$html.on('click', '.guide-opener-js', function (e) {
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

	var $foreignNav = $('.foreign__nav');

	if ($foreignNav.length) {
		$foreignNav.children().matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	}
}
/* equal height end */

/**
 *! fixed header on scroll
 * */
function fixedHeader() {
	var $bar = $('.header');
	var barHeight = $bar.outerHeight();
	var scrollPrev = -1;
	var scrollTopFlag = false;
	var initValue = 0;
	var timeout;

	$bar.css({
		position: 'fixed'
	});

	$('.main').on('scroll', function () {
		var scrollTop = $('.main').scrollTop();
		if (timeout) {
			clearTimeout(timeout);
		}

		if (scrollTop > scrollPrev) {
			scrollTopFlag = false;
		} else {
			scrollTopFlag = true;
		}

		$bar.css({
			top: -scrollTop
		});

		timeout = setTimeout(function() {

		}, 400);
		scrollPrev = scrollTop;
	})
}
/* fixed header on scroll*/

/**
 *! walk pages
 * */
function walkPages() {
	//set some variables
	var isAnimating = false,
		firstLoad = false,
		newScaleValue = 1;

	//cache DOM elements
	var dashboard = $('.cd-side-navigation'),
		mainContent = $('.cd-main'),
		loadingBar = $('#cd-loading-bar');

	//select a new section
	dashboard.on('click', 'a', function(event){
		event.preventDefault();
		var target = $(this),
			//detect which section user has chosen
			sectionTarget = target.data('menu');
		if( !target.hasClass('selected') && !isAnimating ) {
			//if user has selected a section different from the one alredy visible - load the new content
			triggerAnimation(sectionTarget, true);
		}

		firstLoad = true;
	});

	//detect the 'popstate' event - e.g. user clicking the back button
	$(window).on('popstate', function() {
		if( firstLoad ) {
			/*
			 Safari emits a popstate event on page load - check if firstLoad is true before animating
			 if it's false - the page has just been loaded
			 */
			var newPageArray = location.pathname.split('/'),
				//this is the url of the page to be loaded
				newPage = newPageArray[newPageArray.length - 1].replace('.html', '');
			if( !isAnimating ) triggerAnimation(newPage, false);
		}
		firstLoad = true;
	});

	//scroll to content if user clicks the .cd-scroll icon
	mainContent.on('click', '.cd-scroll', function(event){
		event.preventDefault();
		var scrollId = $(this.hash);
		$(scrollId).velocity('scroll', { container: $(".cd-section") }, 200);
	});

	//start animation
	function triggerAnimation(newSection, bool) {
		isAnimating =  true;
		newSection = ( newSection == '' ) ? 'index' : newSection;

		//update dashboard
		dashboard.find('*[data-menu="'+newSection+'"]').addClass('selected').parent('li').siblings('li').children('.selected').removeClass('selected');
		//trigger loading bar animation
		initializeLoadingBar(newSection);
		//load new content
		loadNewContent(newSection, bool);
	}

	function initializeLoadingBar(section) {
		var	selectedItem =  dashboard.find('.selected'),
			barHeight = selectedItem.outerHeight(),
			barTop = selectedItem.offset().top,
			windowHeight = $(window).height(),
			maxOffset = ( barTop + barHeight/2 > windowHeight/2 ) ? barTop : windowHeight- barTop - barHeight,
			scaleValue = ((2*maxOffset+barHeight)/barHeight).toFixed(3)/1 + 0.001;

		//place the loading bar next to the selected dashboard element
		loadingBar.data('scale', scaleValue).css({
			height: barHeight,
			top: barTop
		}).attr('class', '').addClass('loading '+section);
	}

	function loadNewContent(newSection, bool) {
		setTimeout(function(){
			//animate loading bar
			loadingBarAnimation();

			//create a new section element and insert it into the DOM
			var section = $('<div class="main cd-section overflow-hidden '+newSection+'"></div>').prependTo(mainContent);

			section.css({
				'-webkit-transform':'translateX(-100%)',
				'-ms-transform':'translateX(-100%)',
				'transform':'translateX(-100%)'
			});

			//load the new content from the proper html file
			section.load(newSection+'.html .cd-section > *', function(event){
				//finish up the animation and then make the new section visible
				var scaleMax = loadingBar.data('scale');

				loadingBar.velocity('stop').velocity({
					scaleY: scaleMax
				}, 400, function(){
					//add the .visible class to the new section element -> it will cover the old one
					section
						.css({
							'-webkit-transform':'translateX(0)',
							'-ms-transform':'translateX(0)',
							'transform':'translateX(0)'
						});

					section
						.prev('.visible').removeClass('visible').end()
						.addClass('visible')
						.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
							resetAfterAnimation(section);
						});

					//if browser doesn't support transition
					if( $('.no-csstransitions').length > 0 ) {
						resetAfterAnimation(section);
					}

					//init main slider
					mainSlider();

					//init toggle info bar
					classToggle();

					var url = newSection+'.html';

					if(url!=window.location && bool){
						//add the new page to the window.history
						//if the new page was triggered by a 'popstate' event, don't add it
						window.history.pushState({path: url},'',url);
					}
				});
			});

		}, 50);
	}

	function loadingBarAnimation() {
		var scaleMax = loadingBar.data('scale');
		if( newScaleValue + 1 < scaleMax) {
			newScaleValue = newScaleValue + 1;
		} else if ( newScaleValue + 0.5 < scaleMax ) {
			newScaleValue = newScaleValue + 0.5;
		}

		loadingBar.velocity({
			scaleY: newScaleValue
		}, 100, loadingBarAnimation);
	}

	function resetAfterAnimation(newSection) {
		//once the new section animation is over, remove the old section and make the new one scrollable
		newSection.removeClass('overflow-hidden').siblings('.cd-section').remove();
		newSection.css({
			'-webkit-transform':'none',
			'-ms-transform':'none',
			'transform':'none'
		});
		isAnimating =  false;
		//reset your loading bar
		resetLoadingBar();
	}

	function resetLoadingBar() {
		loadingBar.removeClass('loading').velocity({
			scaleY: 1
		}, 1);
	}
}
/*walk pages end*/

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

			scrollTop = $scrollArea.scrollTop();

			/*get direct scroll*/
			directScrollToTop = prevScroll > scrollTop;
			// console.log("prevScroll - scrollTop: " + prevScroll + ", " + scrollTop);
			// console.log("Вверх? (до scrollToSection()): ", directScrollToTop);

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

/**!
 * history
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

			setTimeout(function () {
				self.scrollToSection();
			}, 100)
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

		self.$showPhotosBtn.on('click', function (e) {
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

		self.$bgImg.on('click', function (e) {
			e.preventDefault();

			if (self.options.bgImg && self.bgImgShow) {
				self.togglePhotoShowClass();
			}

		})
	};
	/*images view toggle end*/

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

		$('body').on('click', '.images-gallery__item', function (e) {
			e.preventDefault();

			$('.images-gallery__list', $imagesGallery).slick('slickGoTo', $(this).attr('data-slick-index'));
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
						breakpoint: 640,
						settings: {}
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

	// modal img
	$body.on('click', '.slick-current .modal-img', function() {
		console.log("1: ", 1);
		var href = $(this).attr('href');
		var alt = $(this).find('img').attr('alt');
		var data = '<div class="modal"><div class="modal__overlay"></div><div class="modal__wrap"><div class="modal__align"><div class="modal__container"><div class="modal__img__wrap"><img src="' + href +'" alt="' + alt + '" /></div></div></div><a class="modal__close"><span>Close</span></a></div></div>';

		$body.addClass('body--no-scroll');
		$body.append(data);
		modalIsOpen = true;
		$('.modal').addClass('modal--img').show(0, function() {
			$('.modal').addClass('modal--active');
		});

		return false;
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
 *!  ready/load/resize document
 * */

jQuery(document).ready(function(){
	placeholderInit();
	printShow();
	mainSlider();
	classToggle();
	parallaxMainSlider();
	hoverClassInit();
	equalHeightInit();
	// fixedHeader();
	// walkPages();
	historySwitcher();
	tabSwitcher();
	addBottomSpacer();
	imagesGalleryInit();
	newsSliderInit();
	modalWindowInit();
	upZindex();

	if ($('.main').hasClass('about')) {
		secondaryNav = new secondNav();
	}
});