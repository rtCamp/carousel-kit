import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import type { CarouselSlideAttributes } from '../types';

export default function Edit( {
	context,
}: {
	attributes: CarouselSlideAttributes;
	context: { 'core-carousel/carousel/allowedSlideBlocks'?: string[] };
} ) {
	const allowedBlocks = context[ 'core-carousel/carousel/allowedSlideBlocks' ];

	const blockProps = useBlockProps( {
		className: 'embla__slide',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks:
			allowedBlocks && allowedBlocks.length > 0 ? allowedBlocks : undefined,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
