import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import type { CarouselAttributes } from './types';

/**
 * v2.0.0 save — before a11y announcement fields were added to context
 * and the live-region <span> was appended.
 *
 * @param {Object}             root0            Component props.
 * @param {CarouselAttributes} root0.attributes Block attributes.
 */
function SaveV200( {
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

	const context = {
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
		isPlaying: !! autoplay,
		timerIterationId: 0,
		selectedIndex: -1,
		scrollSnaps: [] as { index: number }[],
		canScrollPrev: false,
		canScrollNext: false,
		scrollProgress: 0,
		slideCount: 0,
		/* translators: %d: slide number */
		ariaLabelPattern: __( 'Go to slide %d', 'rt-carousel' ),
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
		'data-wp-init': 'callbacks.initCarousel',
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

	return <div { ...innerBlocksProps } />;
}

const deprecated = [
	{
		attributes: {
			allowedSlideBlocks: { type: 'array' as const, default: [] },
			loop: { type: 'boolean' as const, default: false },
			dragFree: { type: 'boolean' as const, default: false },
			carouselAlign: { type: 'string' as const, default: 'start' },
			containScroll: { type: 'string' as const, default: 'trimSnaps' },
			direction: { type: 'string' as const, default: 'ltr' },
			axis: { type: 'string' as const, default: 'x' },
			height: { type: 'string' as const, default: '300px' },
			autoplay: { type: 'boolean' as const, default: false },
			autoplayDelay: { type: 'number' as const, default: 4000 },
			autoplayStopOnInteraction: { type: 'boolean' as const, default: true },
			autoplayStopOnMouseEnter: { type: 'boolean' as const, default: false },
			ariaLabel: { type: 'string' as const, default: 'Carousel' },
			slideGap: { type: 'number' as const, default: 0 },
			slidesToScroll: { type: 'string' as const, default: '1' },
		},
		supports: {
			interactivity: true,
			align: [ 'wide', 'full' ],
			html: false,
			color: {
				text: false,
				background: true,
			},
		},
		save: SaveV200,
	},
];

export default deprecated;
