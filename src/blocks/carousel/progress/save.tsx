import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'rt-carousel-progress',
			} ) }
			data-wp-interactive="rt-carousel/carousel"
		>
			<div
				className="rt-carousel-progress__bar"
				role="progressbar"
				aria-label={ __( 'Carousel progress', 'rt-carousel' ) }
				aria-valuemin={ 0 }
				aria-valuemax={ 100 }
				data-wp-bind--aria-valuenow="callbacks.getProgressBarNow"
				data-wp-bind--style="callbacks.getProgressBarStyle"
			/>
		</div>
	);
}
