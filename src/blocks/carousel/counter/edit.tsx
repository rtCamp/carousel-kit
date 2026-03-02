import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { EditorCarouselContext } from '../editor-context';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'carousel-kit-counter',
	} );

	const { emblaApi } = useContext( EditorCarouselContext );
	const [ totalSlides, setTotalSlides ] = useState( 0 );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );

	useEffect( () => {
		if ( ! emblaApi ) {
			return;
		}

		const onInit = () => {
			setTotalSlides( emblaApi.slideNodes().length );
			setSelectedIndex( emblaApi.selectedScrollSnap() );
		};

		const onSelect = () => {
			setSelectedIndex( emblaApi.selectedScrollSnap() );
		};

		emblaApi.on( 'init', onInit );
		emblaApi.on( 'reInit', onInit );
		emblaApi.on( 'select', onSelect );

		onInit(); // Initial load.

		return () => {
			emblaApi.off( 'init', onInit );
			emblaApi.off( 'reInit', onInit );
			emblaApi.off( 'select', onSelect );
		};
	}, [ emblaApi ] );

	// Calculate current slide (1-based) - fallback to 1 if no slides yet.
	const currentSlide = selectedIndex + 1;

	return (
		<div { ...blockProps }>
			<span className="carousel-kit-counter__current">{ currentSlide }</span>
			<span className="carousel-kit-counter__separator"> { __( 'of', 'carousel-kit' ) } </span>
			<span className="carousel-kit-counter__total">{ totalSlides || 1 }</span>
		</div>
	);
}
