import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { EditorCarouselContext } from '../editor-context';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';
import type { EmblaCarouselType } from 'embla-carousel';

const EMBLA_KEY = Symbol.for( 'carousel-kit.carousel' );

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'carousel-kit-dots',
	} );

	const { emblaApi: contextApi } = useContext( EditorCarouselContext );
	const ref = useRef<HTMLDivElement>( null );
	const [ scrollSnaps, setScrollSnaps ] = useState<number[]>( [] );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );

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

	useEffect( () => {
		const findAndBind = () => {
			const api = contextApi || getEmblaFromDOM();

			if ( ! api ) {
				return false;
			}

			const onInit = () => {
				setScrollSnaps( api.scrollSnapList() );
				setSelectedIndex( api.selectedScrollSnap() );
			};

			const onSelect = () => {
				setSelectedIndex( api.selectedScrollSnap() );
			};

			api.on( 'init', onInit );
			api.on( 'reInit', onInit );
			api.on( 'select', onSelect );

			onInit(); // Initial load

			return () => {
				api.off( 'init', onInit );
				api.off( 'reInit', onInit );
				api.off( 'select', onSelect );
			};
		};

		// Try immediately
		let cleanup = findAndBind();

		// If failed, try again shortly (waiting for Viewport init)
		if ( ! cleanup ) {
			const timer = setTimeout( () => {
				cleanup = findAndBind();
			}, 100 );
			return () => {
				clearTimeout( timer );
				if ( cleanup && typeof cleanup === 'function' ) {
					cleanup();
				}
			};
		}

		return cleanup;
	}, [ contextApi ] );

	// Fallback for editor UX when no API yet (e.g. empty)
	const dotsToRender = scrollSnaps.length > 0 ? scrollSnaps : [ 0, 1, 2 ];

	return (
		<div { ...blockProps } ref={ ref }>
			{ dotsToRender.map( ( _, index ) => (
				<button
					key={ index }
					className={ `carousel-kit-dot ${ index === selectedIndex ? 'is-active' : '' }` }
					onClick={ () => {
						const api = contextApi || getEmblaFromDOM();
						if ( api ) {
							api.scrollTo( index );
						}
					} }
					type="button"
					/* translators: %d: slide number */
					aria-label={ sprintf( __( 'Go to slide %d', 'carousel-kit' ), index + 1 ) }
				/>
			) ) }
		</div>
	);
}
