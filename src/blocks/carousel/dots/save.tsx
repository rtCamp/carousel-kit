import { useBlockProps } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'carousel-kit-dots',
	} );

	return (
		<div { ...blockProps }>
			{ /* Iterate over scrollSnaps objects: { index: 0 }, { index: 1 } ... */ }

			<template data-wp-each--snap="context.scrollSnaps">
				<button
					className="carousel-kit-dot"
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
