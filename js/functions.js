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
 *!  placeholder
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
		console.log(1);

		var scrollTop = $('.main').scrollTop();

		console.log("scrollPrev: ", scrollPrev);
		console.log("scrollTop: ", scrollTop);

		if (timeout) {
			clearTimeout(timeout);
		}

		if (scrollTop > scrollPrev) {
			scrollTopFlag = false;
		} else {
			scrollTopFlag = true;
		}

		if (scrollTopFlag) {
			console.log("scrollTopFlag: ", initValue++);
		} else {
			console.log("scrollTopFlag: ", initValue--);
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
	var sectionArr;
	var scrollArea = ".main";
	var section = 'section[data-side-nav]';
	var nav = '.side';
	var activeClassForNav = 'active';
	var activeClassForSection = 'active-section';
	var animationName = 'fixed'; // 'fixed', 'opacity' or 'parallax'

	self.initialize = function() {
		findNavItems();
		setScroll();
		setActions()
	};

	var setActions = function() {
		$(nav).on('click', "li", function(e) {
			e.preventDefault();

			if ($(this).hasClass(activeClassForNav)) return;

			var $currentSection = $("#" + $(this).data('section'));

			TweenMax.to($(scrollArea), 0.3, {scrollTo: {
				y: $currentSection.position().top},
				ease: Power2.easeInOut,
				onComplete: function () {
					$(section).removeClass(activeClassForSection);
					$currentSection.addClass(activeClassForSection)
				}
			});

			$(this).addClass(activeClassForNav).siblings().removeClass(activeClassForNav);
		})
	};

	var setScroll = function() {
		var $initialNavItem = $(nav).find("li").eq(0);
		var $section = $(section);
		var $currentSection = $("#" + $initialNavItem.data('section'));

		$initialNavItem.addClass(activeClassForNav);

		$section.removeClass(activeClassForSection);
		$currentSection.addClass(activeClassForSection);

		$(scrollArea).scroll(function() {
			var scrollTop = $(scrollArea).scrollTop();

			if (scrollTop > 0) {
				$(scrollArea).addClass('is-scrolled')
			} else {
				$(scrollArea).removeClass('is-scrolled')
			}

			for (var i = 0; i < sectionArr.length; i++) {
				$currentSection = $(sectionArr[i]);

				var offset = $currentSection.position().top,
					scrollAreaHeight = $(scrollArea).outerHeight(),
					sectionOffset = scrollTop - offset;

				if ( sectionOffset >= -(scrollAreaHeight/2)) {
				// if ( offset - scrollTop >= 0 && offset - scrollTop <= 100 ) {
				// if ( $currentSection.position().top - scrollTop >= 0) {

					$('li', nav).removeClass(activeClassForNav);

					$('li[data-section="' + $currentSection.attr("id") + '"]', nav).addClass(activeClassForNav);

					$section.removeClass(activeClassForSection);
					$currentSection.addClass(activeClassForSection);
				}
			}

			// scrollAnimation();
		})
	};

	var findNavItems = function() {
		sectionArr = [];
		$("section").each(function() {
			if ($(this).attr("data-side-nav")) {
				sectionArr.push($(this))
			}
		});
		createNavigation()
	};

	var createNavigation = function() {
		var navTpl = '<nav class="side"><ul></li></nav>';

		$('body').append(navTpl);

		for (var i = 0; i < sectionArr.length; i++) {
			$(nav).find("ul")
				.append(
					'<li data-lpos="sidenav" data-lid="click_' + $(sectionArr[i]).attr("id") + '" data-section="' + $(sectionArr[i]).attr("id") + '">' +
					'<a data-lpos="sidenav" data-lid="click_' + $(sectionArr[i]).attr("id") + '" href="#' + $(sectionArr[i]).attr("id") + '">' +
					'<i class="side__circle"></i>' +
					'<span class="side__label">' + $(sectionArr[i]).data("side-nav") + '</span>' +
					'</a>' +
					'</li>'
				)
		}
	};

	// scrollAnimation();

	function scrollAnimation(){
		(!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
	}

	function animateSection() {
		var scrollTop = $(scrollArea).scrollTop(),
			windowHeight = $(section).outerHeight();
			// windowHeight = $(window).height();

		$(section).each(function(){
			var actualBlock = $(this),
				offset = scrollTop - actualBlock.position().top;

			console.log("scrollTop: ", scrollTop);
			console.log("actualBlock.position().top: ", actualBlock.position().top);

			//according to animation type and window scroll, define animation parameters
			var animationValues = setSectionAnimation(offset, windowHeight, animationName);

			transformSection(
				// actualBlock.children('.section-aside'),
				actualBlock.find('.section-aside'),
				animationValues[0],
				animationValues[1],
				animationValues[2],
				animationValues[3],
				animationValues[4]
			);
			( offset >= 0 && offset < windowHeight ) ? actualBlock.addClass('visible') : actualBlock.removeClass('visible');
		});
	}

	function setSectionAnimation(sectionOffset, windowHeight, animationName ) {
		// select section animation - normal scroll
		var scale = 1,
			translateY = 100,
			rotateX = '0deg',
			opacity = 1,
			boxShadowBlur = 0;

		console.log("sectionOffset (scrollTop - actualBlock.position().top): ", sectionOffset);
		console.log("windowHeight/2: ", windowHeight/2);

		if( sectionOffset >= -(windowHeight) && sectionOffset <= 0 ) {
			// section entering the viewport
			translateY = (-sectionOffset)*100/windowHeight;

			switch(animationName) {
				case 'opacity':
					translateY = 0;
					// scale = (sectionOffset + 5*windowHeight)*0.2/windowHeight;
					opacity = (sectionOffset + windowHeight)/(windowHeight);
					break;
			}

		} else if( sectionOffset > 0 && sectionOffset <= windowHeight ) {
			//section leaving the viewport - still has the '.visible' class
			translateY = (-sectionOffset)*100/windowHeight;

			switch(animationName) {
				case 'opacity':
					translateY = 0;
					// scale = (sectionOffset + 5*windowHeight)*0.2/windowHeight;
					opacity = ( windowHeight - sectionOffset )/windowHeight;
					break;
				case 'fixed':
					translateY = 0;
					break;
				case 'parallax':
					translateY = (-sectionOffset)*50/windowHeight;
					break;
			}

		} else if( sectionOffset < -(windowHeight) ) {
			//section not yet visible
			translateY = 100;

			switch(animationName) {
				case 'opacity':
					translateY = 0;
					// scale = 0.8;
					opacity = 0;
					break;
			}

		} else {
			//section not visible anymore
			translateY = -100;

			switch(animationName) {
				case 'opacity':
					translateY = 0;
					// scale = 1.2;
					opacity = 0;
					break;
				case 'fixed':
					translateY = 0;
					break;
				case 'parallax':
					translateY = -50;
					break;
			}
		}

		return [translateY, scale, rotateX, opacity, boxShadowBlur];
	}

	function transformSection(element, translateY, scaleValue, rotateXValue, opacityValue, boxShadow) {
		//transform sections - normal scroll
		element.velocity({
			translateY: translateY+'vh',
			scale: scaleValue,
			rotateX: rotateXValue,
			opacity: opacityValue,
			boxShadowBlur: boxShadow+'px',
			translateZ: 0
		}, 0);
	}


	self.initialize()
}

var secondaryNav;
/*scroll to section end*/

/**!
 * common slider
 * */
function slidersInit() {
	//history text slider
	// var $historySliders = $('.history-text-slider-js');
	var $historySliders = $('.history-sliders-js');
	var $sliderNav = $('.history-periods-js');

	if($historySliders.length) {
		var $historyTextSlider = $historySliders.find('.history-text-slider-js');
		var $historyImagesSlider = $historySliders.find('.history-images-slider-js');

		$('.history-text-slider-js, .history-images-slider-js').on('init', function (event, slick) {

			addCurrentClass(slick.currentSlide);

		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			speed: 300,
			// autoplay: true,
			// autoplaySpeed: 8000,
			dots: false,
			arrows: false,
			fade: true,
			focusOnSelect: true,
			responsive: [
				{
					breakpoint: 640,
					settings: {
						autoplay: false
					}
				}
			]
		}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {

			addCurrentClass(nextSlide);

		});

		// common slider's navigation events
		$sliderNav.on('click', 'a', function(e){

			e.preventDefault();

			var $this = $(this);
			if ($this.parent().hasClass('current-slide')) return false;

			var index = $this.parent().index();
			$historyTextSlider.slick('slickGoTo', index);
			$historyImagesSlider.slick('slickGoTo', index);

		});

		// toggle class current slide on navigation
		function addCurrentClass(index) {

			$sliderNav.find('li').removeClass('current-slide');
			$sliderNav.find('li').eq(index).addClass('current-slide');

		}

		$('.history-images-js').each(function() {
			$(this).on('init', function (event, slick) {

				// addCurrentClass(slick.currentSlide);

			}).slick({
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: false,
				arrows: false,
				touchMove: false,
				draggable: false,
				accessibility: false,
				swipe: false,
				lazyLoad: 'ondemand',
			}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {

				// addCurrentClass(nextSlide);

			});
		});
	}
}
/*common slider end*/

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
	walkPages();
	slidersInit();

	if ($('.main').hasClass('about')) {
		secondaryNav = new secondNav();
	}
});