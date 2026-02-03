import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'embla__slide',
		role: 'group',
		'aria-roledescription': 'slide',
		'data-wp-interactive': 'core-carousel/carousel',
		'data-wp-class--is-active': 'callbacks.isSlideActive',
		'data-wp-bind--aria-current': 'callbacks.isSlideActive',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
