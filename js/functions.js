/**!
 * resize only width
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

/**!
 * device detected
 * */
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

/**!
 *  placeholder
 *  */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/*placeholder end*/

/**!
 * print
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}
/*print end*/

/**
 * parallax on mousemove
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
 * main slider
 * */
function mainSlider() {
	'use strict';

	var $container = $('.ms-js');
	if (!$container.length) return false;

	var activeClass = 'active',
		hideClass = 'hide',
		index = 0;

	var images = '.ms-img-js';

	var $tab = [
		images,
		'.ms-bg-js',
		'.ms-desks-js',
		'.main-slider-title-js'
		// '.ms-dots-js button'
	];

	/* html */
	// <div class="ms-dots-js">
	// <button class="active">1</button>
	// <button>2</button>
	// <button>3</button>
	// <button>4</button>
	// </div>
	/* html end */

	$.each($container, function () {
		var currentSlider = $(this);

		var currentSlideIndex = index;
		var totalLength = $(images, currentSlider).length;

		slidesCounter(currentSlider, currentSlideIndex, totalLength);
	});

	$('.ms-dots-js').on('click', 'button', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);

		if ($currentBtn.hasClass(activeClass)) return false;

		var $currentSlider = $currentBtn.closest($container);
		index = $currentBtn.index();

		switchStateTab($currentSlider,$tab);
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

		switchStateTab($currentSlider,$tab);
		switchStateTab($currentSlider,$tab,index);
		
		slidesCounter($currentSlider,index,length);

		return index;
	});

	function switchStateTab(content,tab,index) {
		// if property "index" length class added
		// else class removed
		if (Array.isArray(tab)){
			for(var i = 0; i < tab.length; i++) {
				if (index !== undefined) {
					content.find(tab[i]).eq(index).addClass(activeClass);
				} else {
					content.find(tab[i]).removeClass(activeClass);
				}
			}
		} else {
			if (index !== undefined) {
				content.find(tab).eq(index).addClass(activeClass);
			} else {
				content.find(tab).removeClass(activeClass);
			}
		}
	}

	function slidesCounter(slider, currentSlideIndex, totalLength) {
		$('.ms-current-slide-js', slider).text(currentSlideIndex + 1);
		$('.ms-total-js', slider).text(totalLength);
	}
}
/*main slider end*/

/**
 * info bar toggle
 * */
function classToggle() {
	// info bar toggle
	$('body').on('click', '.info-btn-js a, .info-bar__overlay', function (e) {
		var activeClass = "info-bar-show";
		if ($('.info-bar-js').length) {
			e.preventDefault();

			var $html = $('html');

			$html.toggleClass(activeClass, !$html.hasClass(activeClass));
		}
	});

	// guide toggle
	$('body').on('click', '.guide-opener-js', function (e) {
		var activeClass = "guide-show";
		if ($('.guide').length) {
			e.preventDefault();

			var $html = $('html');

			$html.toggleClass(activeClass, !$html.hasClass(activeClass));

			e.stopPropagation();
		}
	});

	$(document).on('click', function (e) {
		if ($('html').hasClass('guide-show') && !$(e.target).hasClass('guide__align') && !$(e.target).parents().hasClass('guide__align')) {
			$('html').removeClass('guide-show');
		}
	})
}
/*info bar toggle end*/

/**
 * jquery.toggleHoverClass
 * */
(function ($) {
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

		if (!DESKTOP) {
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

		if (!DESKTOP) {

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
 * toggle hover class
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
 * fixed header on scroll
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
 * walk pages
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
			var section = $('<section class="main cd-section overflow-hidden '+newSection+'"></section>').prependTo(mainContent);
			//load the new content from the proper html file
			section.load(newSection+'.html .cd-section > *', function(event){
				//finish up the animation and then make the new section visible
				var scaleMax = loadingBar.data('scale');

				loadingBar.velocity('stop').velocity({
					scaleY: scaleMax
				}, 400, function(){
					//add the .visible class to the new section element -> it will cover the old one
					section.prev('.visible').removeClass('visible').end().addClass('visible').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
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

/** ready/load/resize document **/

jQuery(document).ready(function(){
	placeholderInit();
	printShow();
	mainSlider();
	classToggle();
	// parallaxMainSlider();
	hoverClassInit();
	fixedHeader();
	// walkPages();
});