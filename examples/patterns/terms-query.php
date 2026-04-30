<?php
/**
 * Title: rtCarousel: Terms Query Carousel
 * Slug: rt-carousel/terms-query-carousel
 * Categories: rt-carousel
 * Description: A carousel block containing a Terms Query displaying taxonomy terms (categories, tags, custom taxonomies) as slides.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<!-- wp:rt-carousel/carousel {"ariaLabel":"rtCarousel: Terms Query Carousel","slideGap":16,"metadata":{"name":"rtCarousel: Terms Query Carousel","categories":["rt-carousel"],"patternName":"rt-carousel/terms-query-carousel"},"align":"wide","className":"wp-block-carousel-carousel is-style-columns-3"} -->
<div class="wp-block-rt-carousel-carousel alignwide rt-carousel wp-block-carousel-carousel is-style-columns-3" role="region" aria-roledescription="carousel" aria-label="rtCarousel: Terms Query Carousel" dir="ltr" data-axis="x" data-wp-interactive="rt-carousel/carousel" data-wp-context="{&quot;options&quot;:{&quot;loop&quot;:false,&quot;dragFree&quot;:false,&quot;align&quot;:&quot;start&quot;,&quot;containScroll&quot;:&quot;trimSnaps&quot;,&quot;direction&quot;:&quot;ltr&quot;,&quot;axis&quot;:&quot;x&quot;,&quot;slidesToScroll&quot;:1},&quot;autoplay&quot;:false,&quot;isPlaying&quot;:false,&quot;timerIterationId&quot;:0,&quot;selectedIndex&quot;:-1,&quot;scrollSnaps&quot;:[],&quot;canScrollPrev&quot;:false,&quot;canScrollNext&quot;:false,&quot;scrollProgress&quot;:0,&quot;slideCount&quot;:0,&quot;ariaLabelPattern&quot;:&quot;Go to slide %d&quot;}" data-wp-init="callbacks.initCarousel" style="--rt-carousel-gap:16px"><!-- wp:rt-carousel/carousel-viewport {"className":"wp-block-carousel-carousel-viewport"} -->
	<div class="wp-block-rt-carousel-carousel-viewport embla wp-block-carousel-carousel-viewport">
		<div class="embla__container"><!-- wp:terms-query {"termQuery":{"perPage":10,"taxonomy":"category","order":"asc","orderBy":"name","include":[],"hideEmpty":false,"showNested":false,"inherit":false}} -->
			<div class="wp-block-terms-query"><!-- wp:term-template -->
				<!-- wp:group {"className":"is-style-section-1","style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}},"border":{"radius":{"topLeft":"10px","topRight":"10px","bottomLeft":"10px","bottomRight":"10px"}},"color":{"background":"#f6f6f6"}},"layout":{"inherit":false}} -->
				<div class="wp-block-group is-style-section-1 has-background" style="border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-left-radius:10px;border-bottom-right-radius:10px;background-color:#f6f6f6;padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- wp:term-name {"isLink":true,"fontSize":"x-large"} /-->

					<!-- wp:term-description /-->

					<!-- wp:term-count /-->
				</div>
				<!-- /wp:group -->
				<!-- /wp:term-template -->
			</div>
			<!-- /wp:terms-query -->
		</div>
	</div>
	<!-- /wp:rt-carousel/carousel-viewport -->

	<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--30);margin-bottom:0"><!-- wp:rt-carousel/carousel-controls {"className":"wp-block-carousel-carousel-controls"} -->
		<div class="wp-block-rt-carousel-carousel-controls rt-carousel-controls wp-block-carousel-carousel-controls"><button type="button" class="rt-carousel-controls__btn rt-carousel-controls__btn--prev" data-wp-on--click="actions.scrollPrev" data-wp-bind--disabled="!state.canScrollPrev" aria-label="Previous Slide"><svg class="rt-carousel-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 3.55371L3.55371 7.10742V4.26562H12.7861V2.84375H3.55371V0L0 3.55371Z" fill="#1C1C1C"></path>
			</svg></button><button type="button" class="rt-carousel-controls__btn rt-carousel-controls__btn--next" data-wp-on--click="actions.scrollNext" data-wp-bind--disabled="!state.canScrollNext" aria-label="Next Slide"><svg class="rt-carousel-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.7861 3.55371L9.23242 7.10742V4.26562H0V2.84375H9.23242V0L12.7861 3.55371Z" fill="#1C1C1C"></path>
			</svg></button></div>
		<!-- /wp:rt-carousel/carousel-controls -->

		<!-- wp:rt-carousel/carousel-dots {"className":"wp-block-carousel-carousel-dots"} -->
		<div class="wp-block-rt-carousel-carousel-dots rt-carousel-dots wp-block-carousel-carousel-dots"><template data-wp-each--snap="context.scrollSnaps"><button class="rt-carousel-dot" data-wp-class--is-active="callbacks.isDotActive" data-wp-bind--aria-current="callbacks.isDotActive" data-wp-on--click="actions.onDotClick" data-wp-bind--aria-label="callbacks.getDotLabel" type="button"></button></template></div>
		<!-- /wp:rt-carousel/carousel-dots -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:rt-carousel/carousel -->
