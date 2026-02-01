import { useBlockProps } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'core-carousel-dots',
	} );

	return (
		<div { ...blockProps }>
			{ /* Iterate over scrollSnaps objects: { index: 0 }, { index: 1 } ... */ }

			<template data-wp-each--snap="context.scrollSnaps">
				<button
					className="core-carousel-dot"
					data-wp-class--is-active="callbacks.isDotActive"
					data-wp-bind--aria-current="callbacks.isDotActive"
					data-wp-on--click="actions.onDotClick"
					data-wp-bind--aria-label="callbacks.getDotLabel"
					type="button"
				/>
			</template>
		</div>
	);
}
