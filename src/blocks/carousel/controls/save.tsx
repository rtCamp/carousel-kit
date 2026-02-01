import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { NextIcon, PreviousIcon } from './components/icons';

export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'core-carousel-controls',
	} );

	return (
		<div { ...blockProps }>
			<button
				type="button"
				className="core-carousel-controls__btn core-carousel-controls__btn--prev"
				data-wp-on--click="actions.scrollPrev"
				data-wp-bind--disabled="!state.canScrollPrev"
				aria-label={ __( 'Previous Slide', 'core-carousel' ) }
			>
				<PreviousIcon />
			</button>
			<button
				type="button"
				className="core-carousel-controls__btn core-carousel-controls__btn--next"
				data-wp-on--click="actions.scrollNext"
				data-wp-bind--disabled="!state.canScrollNext"
				aria-label={ __( 'Next Slide', 'core-carousel' ) }
			>
				<NextIcon />
			</button>
		</div>
	);
}
