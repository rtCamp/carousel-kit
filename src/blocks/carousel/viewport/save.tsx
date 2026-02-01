import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'embla',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'embla__container',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
