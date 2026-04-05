import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import type { CarouselSlideAttributes } from '../types';

export default function Edit( {
	attributes,
	setAttributes,
	context,
}: {
	attributes: CarouselSlideAttributes;
	setAttributes: ( attributes: Partial<CarouselSlideAttributes> ) => void;
	context: { 'rt-carousel/carousel/allowedSlideBlocks'?: string[] };
} ) {
	const allowedBlocks = context[ 'rt-carousel/carousel/allowedSlideBlocks' ];

	const { verticalAlignment } = attributes;

	const blockProps = useBlockProps( {
		className: `embla__slide${
			verticalAlignment ? ` is-vertically-aligned-${ verticalAlignment }` : ''
		}`,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks:
			allowedBlocks && allowedBlocks.length > 0 ? allowedBlocks : undefined,
		templateLock: false,
	} );

	return (
		<>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					value={ verticalAlignment }
					onChange={ ( value ) =>
						setAttributes( { verticalAlignment: value } )
					}
				/>
			</BlockControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
