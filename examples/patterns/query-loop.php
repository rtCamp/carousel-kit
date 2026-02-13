<?php
/**
 * Title: Carousel Kit: Query Loop Carousel
 * Slug: carousel-kit/query-loop-carousel
 * Categories: carousel-kit
 * Description: A carousel block containing a query loop displaying posts in a grid layout.
 */
?>

<!-- wp:carousel-kit/carousel {"ariaLabel":"Carousel Kit: Query Loop Carousel","slideGap":16,"metadata":{"name":"Carousel Kit: Query Loop Carousel","categories":["carousel-kit"],"patternName":"carousel-kit/query-loop-carousel"},"align":"wide","className":"wp-block-carousel-carousel is-style-default"} -->
<div class="wp-block-carousel-kit-carousel alignwide carousel-kit wp-block-carousel-carousel is-style-default" role="region" aria-roledescription="carousel" aria-label="Carousel Kit: Query Loop Carousel" dir="ltr" data-axis="x" data-wp-interactive="carousel-kit/carousel" data-wp-context="{&quot;options&quot;:{&quot;loop&quot;:false,&quot;dragFree&quot;:false,&quot;align&quot;:&quot;start&quot;,&quot;containScroll&quot;:&quot;trimSnaps&quot;,&quot;direction&quot;:&quot;ltr&quot;,&quot;axis&quot;:&quot;x&quot;,&quot;slidesToScroll&quot;:1},&quot;autoplay&quot;:false,&quot;isPlaying&quot;:false,&quot;timerIterationId&quot;:0,&quot;selectedIndex&quot;:-1,&quot;scrollSnaps&quot;:[],&quot;canScrollPrev&quot;:false,&quot;canScrollNext&quot;:false,&quot;ariaLabelPattern&quot;:&quot;Go to slide %d&quot;}" data-wp-init="callbacks.initCarousel" style="--carousel-kit-gap:16px"><!-- wp:carousel-kit/carousel-viewport {"className":"wp-block-carousel-carousel-viewport"} -->
	<div class="wp-block-carousel-kit-carousel-viewport embla wp-block-carousel-carousel-viewport">
		<div class="embla__container"><!-- wp:carousel-kit/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-carousel-kit-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="carousel-kit/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:query {"queryId":18,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"metadata":{"categories":["posts"],"patternName":"core/query-grid-posts","name":"Grid"}} -->
				<div class="wp-block-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
					<!-- wp:group {"className":"is-style-section-1","style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}},"border":{"radius":{"topLeft":"10px","topRight":"10px","bottomLeft":"10px","bottomRight":"10px"}},"color":{"background":"#f6f6f6"}},"layout":{"inherit":false}} -->
					<div class="wp-block-group is-style-section-1 has-background" style="border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-left-radius:10px;border-bottom-right-radius:10px;background-color:#f6f6f6;padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

						<!-- wp:post-excerpt {"excerptLength":10} /-->

						<!-- wp:post-date {"metadata":{"bindings":{"datetime":{"source":"core/post-data","args":{"field":"date"}}}}} /-->
					</div>
					<!-- /wp:group -->
					<!-- /wp:post-template -->
				</div>
				<!-- /wp:query -->
			</div>
			<!-- /wp:carousel-kit/carousel-slide -->
		</div>
	</div>
	<!-- /wp:carousel-kit/carousel-viewport -->

	<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--30);margin-bottom:0"><!-- wp:carousel-kit/carousel-controls {"className":"wp-block-carousel-carousel-controls"} -->
		<div class="wp-block-carousel-kit-carousel-controls carousel-kit-controls wp-block-carousel-carousel-controls"><button type="button" class="carousel-kit-controls__btn carousel-kit-controls__btn--prev" data-wp-on--click="actions.scrollPrev" data-wp-bind--disabled="!state.canScrollPrev" aria-label="Previous Slide"><svg class="carousel-kit-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 3.55371L3.55371 7.10742V4.26562H12.7861V2.84375H3.55371V0L0 3.55371Z" fill="#1C1C1C"></path>
				</svg></button><button type="button" class="carousel-kit-controls__btn carousel-kit-controls__btn--next" data-wp-on--click="actions.scrollNext" data-wp-bind--disabled="!state.canScrollNext" aria-label="Next Slide"><svg class="carousel-kit-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.7861 3.55371L9.23242 7.10742V4.26562H0V2.84375H9.23242V0L12.7861 3.55371Z" fill="#1C1C1C"></path>
				</svg></button></div>
		<!-- /wp:carousel-kit/carousel-controls -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:carousel-kit/carousel -->
