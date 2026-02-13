import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { NextIcon, PreviousIcon } from './components/icons';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'carousel-kit-controls',
	} );

	return (
		<div { ...blockProps }>
			<button
				type="button"
				className="carousel-kit-controls__btn carousel-kit-controls__btn--prev"
				data-wp-on--click="actions.scrollPrev"
				data-wp-bind--disabled="!state.canScrollPrev"
				aria-label={ __( 'Previous Slide', 'carousel-kit' ) }
			>
				<PreviousIcon />
			</button>
			<button
				type="button"
				className="carousel-kit-controls__btn carousel-kit-controls__btn--next"
				data-wp-on--click="actions.scrollNext"
				data-wp-bind--disabled="!state.canScrollNext"
				aria-label={ __( 'Next Slide', 'carousel-kit' ) }
			>
				<NextIcon />
			</button>
		</div>
	);
}
