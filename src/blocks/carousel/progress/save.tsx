import { useBlockProps } from '@wordpress/block-editor';

export default function Save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'carousel-kit-progress',
			} ) }
			data-wp-interactive="carousel-kit/carousel"
		>
			<div
				className="carousel-kit-progress__bar"
				data-wp-bind--style="callbacks.getProgressBarStyle"
			/>
		</div>
	);
}
