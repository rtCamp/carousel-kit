/**
 * Slide template definitions for the Carousel block.
 *
 * Developers can register additional templates via the
 * `rtcamp.carouselKit.slideTemplates` WordPress filter (applied with `applyFilters`).
 *
 * @package
 */

import { createBlock, type BlockInstance } from '@wordpress/blocks';
import { type IconType } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { columns, image, layout, gallery, post } from '@wordpress/icons';

export interface SlideTemplate {
	/** Unique machine-readable name. */
	name: string;
	/** Human-readable title shown in the picker. */
	label: string;
	/** Short description shown below the label. */
	description: string;
	/** WordPress icon component used in the picker. Accepts any value supported by `<Icon>` from `@wordpress/components`. */
	icon: IconType;
	/**
	 * Whether this template uses a Query Loop instead of individual slides.
	 * When true, `slideCount` is ignored and a `core/query` block is placed
	 * directly inside the carousel viewport.
	 */
	isQueryLoop?: boolean;
	/**
	 * Build the inner blocks for a single slide.
	 * Called once per slide (or not at all for Query Loop templates).
	 */
	innerBlocks: () => BlockInstance[];
}

// ── Default templates ────────────────────────────────────────────────────────

const textSlide: SlideTemplate = {
	name: 'text',
	label: __( 'Text Slides', 'rt-carousel' ),
	description: __( 'Slides starting with a paragraph you can replace or extend.', 'rt-carousel' ),
	icon: columns,
	innerBlocks: () => [ createBlock( 'core/paragraph', {} ) ],
};

const imageSlide: SlideTemplate = {
	name: 'image',
	label: __( 'Image Slides', 'rt-carousel' ),
	description: __( 'Slides prefilled with an image block.', 'rt-carousel' ),
	icon: image,
	innerBlocks: () => [ createBlock( 'core/image', {} ) ],
};

const heroSlide: SlideTemplate = {
	name: 'hero',
	label: __( 'Image + Heading + Text + CTA', 'rt-carousel' ),
	description: __( 'Marketing slider with heading, paragraph, and button.', 'rt-carousel' ),
	icon: layout,
	innerBlocks: () => [
		createBlock( 'core/cover', {}, [
			createBlock( 'core/heading', {
				level: 2,
				placeholder: __( 'Slide Heading', 'rt-carousel' ),
			} ),
			createBlock( 'core/paragraph', {
				placeholder: __( 'Slide description text…', 'rt-carousel' ),
			} ),
			createBlock( 'core/buttons', {}, [
				createBlock( 'core/button', {} ),
			] ),
		] ),
	],
};

const imageCaptionSlide: SlideTemplate = {
	name: 'image-caption',
	label: __( 'Image + Caption', 'rt-carousel' ),
	description: __( 'Image with supporting text below.', 'rt-carousel' ),
	icon: gallery,
	innerBlocks: () => [
		createBlock( 'core/image', {} ),
		createBlock( 'core/paragraph', {
			placeholder: __( 'Caption text…', 'rt-carousel' ),
		} ),
	],
};

const queryLoopSlide: SlideTemplate = {
	name: 'query-loop',
	label: __( 'Query Loop Slides', 'rt-carousel' ),
	description: __( 'Dynamically generate slides from posts.', 'rt-carousel' ),
	icon: post,
	isQueryLoop: true,
	innerBlocks: () => [], // Not used — Query Loop is handled specially.
};

const DEFAULT_TEMPLATES: SlideTemplate[] = [
	textSlide,
	imageSlide,
	heroSlide,
	imageCaptionSlide,
	queryLoopSlide,
];

function getDefaultTemplates(): SlideTemplate[] {
	return DEFAULT_TEMPLATES.map( ( template ) => ( {
		...template,
	} ) );
}

/**
 * Retrieve all available slide templates.
 *
 * External code can add templates via:
 *
 * ```js
 * import { addFilter } from '@wordpress/hooks';
 *
 * addFilter(
 *   'rtcamp.carouselKit.slideTemplates',
 *   'my-plugin/custom-templates',
 *   ( templates ) => [
 *     ...templates,
 *     {
 *       name: 'testimonial',
 *       label: 'Testimonial',
 *       description: 'Quote with author name.',
 *       icon: 'format-quote',
 *       innerBlocks: () => [
 *         createBlock( 'core/quote', {} ),
 *         createBlock( 'core/paragraph', { placeholder: '— Author' } ),
 *       ],
 *     },
 *   ],
 * );
 * ```
 */
export function getSlideTemplates(): SlideTemplate[] {
	const defaultTemplates = getDefaultTemplates();
	const templates = applyFilters(
		'rtcamp.carouselKit.slideTemplates',
		defaultTemplates,
	);

	if ( Array.isArray( templates ) ) {
		const valid = ( templates as unknown[] ).filter( ( t ): t is SlideTemplate => {
			if (
				t !== null &&
				t !== undefined &&
				typeof t === 'object' &&
				typeof ( t as SlideTemplate ).name === 'string' &&
				typeof ( t as SlideTemplate ).label === 'string' &&
				typeof ( t as SlideTemplate ).description === 'string' &&
				( t as SlideTemplate ).icon !== undefined &&
				( t as SlideTemplate ).icon !== null &&
				typeof ( t as SlideTemplate ).innerBlocks === 'function'
			) {
				return true;
			}
			// eslint-disable-next-line no-console
			console.warn(
				'rtcamp.carouselKit.slideTemplates: dropping invalid template entry.',
				t,
			);
			return false;
		} );
		return valid;
	}

	// eslint-disable-next-line no-console
	console.warn(
		'rtcamp.carouselKit.slideTemplates filter returned a non-array value. Falling back to default slide templates.',
		templates,
	);

	return defaultTemplates;
}
