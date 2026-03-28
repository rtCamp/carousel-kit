import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import type { CarouselSlideAttributes } from '../types';

export default function Save( { attributes }: { attributes: CarouselSlideAttributes } ) {
	const { verticalAlignment } = attributes;
	const blockProps = useBlockProps.save( {
		className: `embla__slide${
			verticalAlignment ? ` is-vertically-aligned-${ verticalAlignment }` : ''
		}`,
		role: 'group',
		'aria-roledescription': 'slide',
		'data-wp-interactive': 'carousel-kit/carousel',
		'data-wp-class--is-active': 'callbacks.isSlideActive',
		'data-wp-bind--aria-current': 'callbacks.isSlideActive',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
