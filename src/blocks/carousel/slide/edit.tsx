import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { CarouselSlideAttributes } from '../types';

export default function Edit( {
	attributes,
	setAttributes,
	context,
}: {
	attributes: CarouselSlideAttributes;
	setAttributes: ( attributes: Partial<CarouselSlideAttributes> ) => void;
	context: { 'carousel-kit/carousel/allowedSlideBlocks'?: string[] };
} ) {
	const allowedBlocks = context[ 'carousel-kit/carousel/allowedSlideBlocks' ];

	const { verticalAlignment, disableLazyLoadImages = false } = attributes;

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
			<InspectorControls>
				<PanelBody title={ __( 'Slide Settings', 'carousel-kit' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Disable Lazy Load Images', 'carousel-kit' ) }
						checked={ disableLazyLoadImages }
						onChange={ ( value ) => setAttributes( { disableLazyLoadImages: value } ) }
						help={ __(
							'Disable lazy loading for images in this slide (when carousel lazy loading is enabled).',
							'carousel-kit',
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
