import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import { Button, PanelBody, ToolbarButton } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import type { CarouselViewportAttributes } from '../types';
import { useContext, useEffect, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { EditorCarouselContext } from '../editor-context';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

const EMBLA_KEY = Symbol.for( 'carousel-system.carousel' );

export default function Edit( {
	clientId,
}: {
	clientId: string;
	attributes: CarouselViewportAttributes;
} ) {
	const { setEmblaApi, setCanScrollPrev, setCanScrollNext, carouselOptions } = useContext(
		EditorCarouselContext,
	);

	const blockProps = useBlockProps( {
		className: 'embla',
		style: {
			height: carouselOptions?.axis === 'y' ? carouselOptions?.height : undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'embla__container',
			style: {
				height: carouselOptions?.axis === 'y' ? 'auto' : undefined,
				minHeight: carouselOptions?.axis === 'y' ? '100%' : undefined,
				flexDirection: ( carouselOptions?.axis === 'y' ? 'column' : 'row' ) as React.CSSProperties['flexDirection'],
			},
		},
		{
			orientation: carouselOptions?.axis === 'y' ? 'vertical' : 'horizontal',
			allowedBlocks: [ 'carousel-kit/carousel-slide', 'core/query' ],
			template: [ [ 'carousel-kit/carousel-slide' ] ],
		},
	);

	const emblaRef = useRef<HTMLDivElement>( null );
	const ref = useMergeRefs( [ emblaRef, blockProps.ref ] );

	const { insertBlock } = useDispatch( 'core/block-editor' );

	const addSlide = () => {
		const block = createBlock( 'carousel-kit/carousel-slide' );
		insertBlock( block, undefined, clientId );
	};

	useEffect( () => {
		if ( ! emblaRef.current ) {
			return;
		}

		let embla: EmblaCarouselType | undefined;
		let observer: MutationObserver | undefined;

		const initEmbla = () => {
			if ( embla ) {
				embla.destroy();
			}

			const queryLoopContainer = emblaRef.current?.querySelector(
				'.wp-block-post-template',
			) as HTMLElement;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const options = carouselOptions as any;

			embla = EmblaCarousel( emblaRef.current!, {
				loop: options?.loop ?? false,
				dragFree: options?.dragFree ?? false,
				containScroll: options?.containScroll || 'trimSnaps',
				axis: options?.axis || 'x',
				align: options?.align || 'start',
				direction: options?.direction || 'ltr',
				slidesToScroll: options?.slidesToScroll || 1,
				container: queryLoopContainer || undefined,
			} );

			( emblaRef.current as { [EMBLA_KEY]?: typeof embla } )[ EMBLA_KEY ] = embla;

			const onSelect = () => {
				const canPrev = embla!.canScrollPrev();
				const canNext = embla!.canScrollNext();
				setCanScrollPrev( canPrev );
				setCanScrollNext( canNext );
			};

			embla.on( 'select', onSelect );
			embla.on( 'reInit', onSelect );

			// Use requestAnimationFrame to ensure DOM has settled
			requestAnimationFrame( () => {
				onSelect();
			} );

			setEmblaApi( embla );
		};

		initEmbla();

		if ( emblaRef.current ) {
			observer = new MutationObserver( ( mutations ) => {
				let shouldReInit = false;

				for ( const mutation of mutations ) {
					const target = mutation.target as HTMLElement;

					// If the Post Template itself changed (children added/removed)
					if ( target.classList.contains( 'wp-block-post-template' ) ) {
						shouldReInit = true;
						break;
					}

					// If the Post Template was just added to the DOM
					if (
						mutation.addedNodes.length > 0 &&
						( target.querySelector( '.wp-block-post-template' ) ||
							Array.from( mutation.addedNodes ).some(
								( node ) =>
									node instanceof HTMLElement &&
									node.classList.contains( 'wp-block-post-template' ),
							) )
					) {
						shouldReInit = true;
						break;
					}
				}

				if ( shouldReInit ) {
					// Small debounce/timeout to allow render to settle
					setTimeout( initEmbla, 10 );
				}
			} );

			observer.observe( emblaRef.current, {
				childList: true,
				subtree: true,
			} );
		}

		return () => {
			if ( embla ) {
				embla.destroy();
			}
			if ( observer ) {
				observer.disconnect();
			}
			if ( emblaRef.current ) {
				delete ( emblaRef.current as { [EMBLA_KEY]?: typeof embla } )[
					EMBLA_KEY
				];
			}
		};
	}, [ setEmblaApi, setCanScrollPrev, setCanScrollNext, carouselOptions ] );

	return (
		<>
			<BlockControls>
				<ToolbarButton
					icon={ plus }
					label={ __( 'Add Slide', 'carousel-kit' ) }
					onClick={ addSlide }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Viewport Actions', 'carousel-kit' ) }>
					<Button variant="secondary" onClick={ addSlide } icon={ plus }>
						{ __( 'Add Slide', 'carousel-kit' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps } ref={ ref }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
