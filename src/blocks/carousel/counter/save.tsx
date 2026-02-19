import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'carousel-kit-counter',
	} );

	return (
		<div { ...blockProps }>
			<span
				className="carousel-kit-counter__current"
				data-wp-text="callbacks.getCurrentSlideNumber"
			/>
			<span className="carousel-kit-counter__separator"> { __( 'of', 'carousel-kit' ) } </span>
			<span
				className="carousel-kit-counter__total"
				data-wp-text="callbacks.getTotalSlides"
			/>
		</div>
	);
}
