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

/*main slider*/
function mainSlider() {
	'use strict';

	var $container = $('.main-slider-js');
	if (!$container.length) return false;

	var activeClass = 'active',
		hideClass = 'hide',
		index = 0;

	var $tab = [
		'.main-slider-bg-js',
		'.main-slider-img-js',
		'.main-slider-desks-js',
		'.main-slider-title-js',
		'.main-slider-dots-js button'
	];

	$('.main-slider-dots-js').on('click', 'button', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);

		if ($currentBtn.hasClass(activeClass)) return false;

		var $currentWrapper = $currentBtn.closest($container);
		index = $currentBtn.index();

		// $('.main-slider-dots-js button').removeClass(activeClass);
		// $currentBtn.addClass(activeClass);

		switchStateTab($currentWrapper,$tab);
		switchStateTab($currentWrapper,$tab,index);

		return index;
	});

	$('.main-slider-arrow-js').on('click', function (e) {
		e.preventDefault();

		var $currentBtn = $(this);
		var $currentWrapper = $currentBtn.closest($container);
		var length = $currentBtn.closest($container).find('.main-slider-img-js').length;

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

		switchStateTab($currentWrapper,$tab);
		switchStateTab($currentWrapper,$tab,index);

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
	
	
}
/*main slider end*/

/** ready/load/resize document **/

jQuery(document).ready(function(){
	placeholderInit();
	printShow();
	mainSlider();

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

					mainSlider();

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
});