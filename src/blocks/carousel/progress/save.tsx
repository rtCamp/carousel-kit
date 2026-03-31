import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
				role="progressbar"
				aria-label={ __( 'Carousel progress', 'carousel-kit' ) }
				aria-valuemin={ 0 }
				aria-valuemax={ 100 }
				data-wp-bind--aria-valuenow="callbacks.getProgressBarNow"
				data-wp-bind--style="callbacks.getProgressBarStyle"
			/>
		</div>
	);
}
