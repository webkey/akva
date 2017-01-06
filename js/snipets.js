if (
	!tween.isActive() && !directScrollToTop && (offsetWhile + bufferZone < scrollTop) && ((offsetNext - bufferZone) < (scrollTop + scrollAreaHeight))

// !tween.isActive() && !directScrollToTop && (offsetWhile + bufferZone < scrollTop) && ((offsetNext + bufferZone) < (scrollTop + scrollAreaHeight))
// // ||
// // !tween.isActive() && !directScrollToTop && ((offsetNext + bufferZone) < (scrollTop + scrollAreaHeight))
// ||
// !tween.isActive() && directScrollToTop && (offsetNext - bufferZone < scrollTop)

// !tween.isActive() && (offsetNext + bufferZone < scrollAreaHeight + scrollTop)
// &&
// (offsetNext - bufferZone < scrollTop)

// !tween.isActive() && prevScroll < scrollTop && (offsetNext + bufferZone < scrollAreaHeight + scrollTop)
// ||
// !tween.isActive() && prevScroll > scrollTop && (offsetNext - bufferZone < scrollTop)
) {

	prevScroll = scrollTop;

	console.log("------------ next -----------");
	// scrollToNextSection();

	// } else if ( whileSectionHeight <= scrollAreaHeight || (offsetWhile + bufferZone > scrollTop) )
} else

// if (!tween.isActive() && prevScroll > scrollTop && $nextSection) {

{

	prevScroll = scrollTop;

	console.log("------------ prev ------------");
	// scrollToWhileSection();

	return;
}