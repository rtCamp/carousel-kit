import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useContext, useRef } from '@wordpress/element';
import { EditorCarouselContext } from '../editor-context';
import { NextIcon, PreviousIcon } from './components/icons';
import type { EmblaCarouselType } from 'embla-carousel';

const EMBLA_KEY = Symbol.for( 'carousel-system.carousel' );

export default function Edit() {
	const {
		emblaApi: contextApi,
		canScrollPrev,
		canScrollNext,
	} = useContext( EditorCarouselContext );
	const ref = useRef<HTMLDivElement>( null );

	const blockProps = useBlockProps( {
		className: 'carousel-kit-controls',
	} );

	const getEmblaFromDOM = () => {
		if ( ! ref.current ) {
			return null;
		}
		const wrapper = ref.current.closest( '.carousel-kit' );
		if ( ! wrapper ) {
			return null;
		}
		const viewport = wrapper.querySelector( '.embla' );
		if ( ! viewport ) {
			return null;
		}

		return ( viewport as { [EMBLA_KEY]?: EmblaCarouselType } )[ EMBLA_KEY ] ?? null;
	};

	const handleScroll = ( direction: 'prev' | 'next' ) => {
		const api = contextApi || getEmblaFromDOM();
		if ( api ) {
			if ( direction === 'prev' ) {
				api.scrollPrev();
			} else {
				api.scrollNext();
			}
		}
	};

	return (
		<div { ...blockProps } ref={ ref }>
			<button
				className="carousel-kit-controls__btn carousel-kit-controls__btn--prev"
				onClick={ ( e ) => {
					e.stopPropagation();
					handleScroll( 'prev' );
				} }
				type="button"
				disabled={ ! canScrollPrev }
				aria-label={ __( 'Previous Slide', 'carousel-kit' ) }
			>
				<PreviousIcon />
			</button>
			<button
				className="carousel-kit-controls__btn carousel-kit-controls__btn--next"
				onClick={ ( e ) => {
					e.stopPropagation();
					handleScroll( 'next' );
				} }
				type="button"
				disabled={ ! canScrollNext }
				aria-label={ __( 'Next Slide', 'carousel-kit' ) }
			>
				<NextIcon />
			</button>
		</div>
	);
}
