<?php
/**
 * Title: rtCarousel: Logo Showcase
 * Slug: rt-carousel/logo-showcase
 * Categories: rt-carousel
 * Description: Display partner or client logos in a continuous carousel
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$pattern_images_url = trailingslashit( RT_CAROUSEL_URL . '/examples/data/images' );
$logo_one           = $pattern_images_url . 'logo-placeholder-1.svg';
$logo_two           = $pattern_images_url . 'logo-placeholder-2.svg';
$logo_three         = $pattern_images_url . 'logo-placeholder-3.svg';
$logo_four          = $pattern_images_url . 'logo-placeholder-4.svg';
$logo_five          = $pattern_images_url . 'logo-placeholder-5.svg';
?>

<!-- wp:rt-carousel/carousel {"loop":true,"autoplayDelay":3000,"autoplayStopOnInteraction":false,"ariaLabel":"Partner Logos","metadata":{"categories":["rt-carousel"],"patternName":"rt-carousel/logo-showcase","name":"rtCarousel: Logo Showcase"},"className":"wp-block-carousel-carousel is-style-columns-3"} -->
<div class="wp-block-rt-carousel-carousel rt-carousel wp-block-carousel-carousel is-style-columns-3" role="region" aria-roledescription="carousel" aria-label="Partner Logos" dir="ltr" data-axis="x" data-loop="true" data-wp-interactive="rt-carousel/carousel" data-wp-context="{&quot;options&quot;:{&quot;loop&quot;:true,&quot;dragFree&quot;:false,&quot;align&quot;:&quot;start&quot;,&quot;containScroll&quot;:&quot;trimSnaps&quot;,&quot;direction&quot;:&quot;ltr&quot;,&quot;axis&quot;:&quot;x&quot;,&quot;slidesToScroll&quot;:1},&quot;autoplay&quot;:false,&quot;isPlaying&quot;:false,&quot;timerIterationId&quot;:0,&quot;selectedIndex&quot;:-1,&quot;scrollSnaps&quot;:[],&quot;canScrollPrev&quot;:false,&quot;canScrollNext&quot;:false,&quot;ariaLabelPattern&quot;:&quot;Go to slide %d&quot;}" data-wp-init="callbacks.initCarousel" style="--rt-carousel-gap:0px"><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"69px"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:69px">Trusted By Leading Companies</h2>
	<!-- /wp:heading -->

	<!-- wp:rt-carousel/carousel-viewport {"className":"wp-block-carousel-carousel-viewport"} -->
	<div class="wp-block-rt-carousel-carousel-viewport embla wp-block-carousel-carousel-viewport">
		<div class="embla__container"><!-- wp:rt-carousel/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-rt-carousel-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="rt-carousel/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:image {"width":"200px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-rounded"} -->
				<figure class="wp-block-image aligncenter size-full is-resized is-style-rounded"><img src="<?php echo esc_url( $logo_one ); ?>" alt="Partner Logo 1" style="width:200px" /></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:rt-carousel/carousel-slide -->

			<!-- wp:rt-carousel/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-rt-carousel-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="rt-carousel/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:image {"width":"200px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-rounded"} -->
				<figure class="wp-block-image aligncenter size-full is-resized is-style-rounded"><img src="<?php echo esc_url( $logo_two ); ?>" alt="Partner Logo 2" style="width:200px" /></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:rt-carousel/carousel-slide -->

			<!-- wp:rt-carousel/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-rt-carousel-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="rt-carousel/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:image {"width":"200px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-rounded"} -->
				<figure class="wp-block-image aligncenter size-full is-resized is-style-rounded"><img src="<?php echo esc_url( $logo_three ); ?>" alt="Partner Logo 3" style="width:200px" /></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:rt-carousel/carousel-slide -->

			<!-- wp:rt-carousel/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-rt-carousel-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="rt-carousel/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:image {"width":"200px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-rounded"} -->
				<figure class="wp-block-image aligncenter size-full is-resized is-style-rounded"><img src="<?php echo esc_url( $logo_four ); ?>" alt="Partner Logo 4" style="width:200px" /></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:rt-carousel/carousel-slide -->

			<!-- wp:rt-carousel/carousel-slide {"className":"wp-block-carousel-carousel-slide"} -->
			<div class="wp-block-rt-carousel-carousel-slide embla__slide wp-block-carousel-carousel-slide" role="group" aria-roledescription="slide" data-wp-interactive="rt-carousel/carousel" data-wp-class--is-active="callbacks.isSlideActive" data-wp-bind--aria-current="callbacks.isSlideActive"><!-- wp:image {"width":"200px","sizeSlug":"full","linkDestination":"none","align":"center","className":"is-style-rounded"} -->
				<figure class="wp-block-image aligncenter size-full is-resized is-style-rounded"><img src="<?php echo esc_url( $logo_five ); ?>" alt="Partner Logo 5" style="width:200px" /></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:rt-carousel/carousel-slide -->
		</div>
	</div>
	<!-- /wp:rt-carousel/carousel-viewport -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
	<div class="wp-block-group"><!-- wp:rt-carousel/carousel-controls {"className":"wp-block-carousel-carousel-controls"} -->
		<div class="wp-block-rt-carousel-carousel-controls rt-carousel-controls wp-block-carousel-carousel-controls"><button type="button" class="rt-carousel-controls__btn rt-carousel-controls__btn--prev" data-wp-on--click="actions.scrollPrev" data-wp-bind--disabled="!state.canScrollPrev" aria-label="Previous Slide"><svg class="rt-carousel-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 3.55371L3.55371 7.10742V4.26562H12.7861V2.84375H3.55371V0L0 3.55371Z" fill="#1C1C1C"></path>
				</svg></button><button type="button" class="rt-carousel-controls__btn rt-carousel-controls__btn--next" data-wp-on--click="actions.scrollNext" data-wp-bind--disabled="!state.canScrollNext" aria-label="Next Slide"><svg class="rt-carousel-controls__icon" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.7861 3.55371L9.23242 7.10742V4.26562H0V2.84375H9.23242V0L12.7861 3.55371Z" fill="#1C1C1C"></path>
				</svg></button></div>
		<!-- /wp:rt-carousel/carousel-controls -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:rt-carousel/carousel -->
