import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import type { CarouselAttributes, CarouselContext } from './types';

export default function Save( {
	attributes,
}: {
	attributes: CarouselAttributes;
} ) {
	const {
		loop,
		dragFree,
		carouselAlign,
		containScroll,
		direction,
		autoplay,
		autoplayDelay,
		autoplayStopOnInteraction,
		autoplayStopOnMouseEnter,
		ariaLabel,
		slideGap,
		axis,
		height,
		slidesToScroll,
	} = attributes;

	// Pass configuration to the frontend via data-wp-context
	const context: CarouselContext = {
		options: {
			loop,
			dragFree,
			align: carouselAlign,
			containScroll,
			direction,
			axis,
			slidesToScroll: slidesToScroll === 'auto' ? 'auto' : parseInt( slidesToScroll, 10 ),
		},
		autoplay: autoplay
			? {
				delay: autoplayDelay,
				stopOnInteraction: autoplayStopOnInteraction,
				stopOnMouseEnter: autoplayStopOnMouseEnter,
			}
			: false,
		isPlaying: !! autoplay, // Initially true if autoplay is enabled
		timerIterationId: 0,
		selectedIndex: -1,
		scrollSnaps: [],
		canScrollPrev: false,
		canScrollNext: false,
		scrollProgress: 0,
		slideCount: 0,
		/* translators: %d: slide number */
		ariaLabelPattern: __( 'Go to slide %d', 'rt-carousel' ),
		announcement: '',
		shouldAnnounce: false,
		/* translators: {{currentSlide}}: current slide number, {{totalSlides}}: total slide count. */
		announcementPattern: __(
			'Slide {{currentSlide}} of {{totalSlides}}',
			'rt-carousel',
		),
	};

	const blockProps = useBlockProps.save( {
		className: 'rt-carousel',
		role: 'region',
		'aria-roledescription': 'carousel',
		'aria-label': ariaLabel,
		dir: direction,
		'data-axis': axis,
		'data-loop': loop ? 'true' : undefined,
		'data-wp-interactive': 'rt-carousel/carousel',
		'data-wp-context': JSON.stringify( context ),
		'data-wp-init': 'callbacks.initCarousel', // Use init for mounting
		style: {
			'--rt-carousel-gap': `${ slideGap }px`,
			'--rt-carousel-height': axis === 'y' ? height : undefined,
		} as React.CSSProperties,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps ) as ReturnType<
		typeof useInnerBlocksProps.save
	> & {
		children: React.ReactNode;
	};
	const { children, ...wrapperProps } = innerBlocksProps;
	const announcementLiveRegion = (
		<span
			className="screen-reader-text"
			role="status"
			aria-live="polite"
			aria-atomic="true"
			data-wp-text="context.announcement"
		/>
	);

	return (
		<div { ...wrapperProps }>
			{ children }
			{ announcementLiveRegion }
		</div>
	);
}
