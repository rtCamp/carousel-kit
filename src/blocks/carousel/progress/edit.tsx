import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
import { EditorCarouselContext } from '../editor-context';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'rt-carousel-progress',
	} );

	const { scrollProgress, selectedIndex, slideCount, carouselOptions } =
		useContext( EditorCarouselContext );

	if ( slideCount <= 1 ) {
		return null;
	}

	const progress = carouselOptions?.loop
		? selectedIndex / ( slideCount - 1 )
		: Math.max( 0, Math.min( 1, scrollProgress || 0 ) );

	return (
		<div { ...blockProps }>
			<div
				className="rt-carousel-progress__bar"
				role="progressbar"
				aria-label={ __( 'Carousel progress', 'rt-carousel' ) }
				aria-valuenow={ Math.round( progress * 100 ) }
				aria-valuemin={ 0 }
				aria-valuemax={ 100 }
				style={ {
					transform: `translate3d(${ progress * 100 }%, 0px, 0px)`,
				} }
			/>
		</div>
	);
}
