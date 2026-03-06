import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import { Button, PanelBody, ToolbarButton } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import type { CarouselViewportAttributes } from '../types';
import { useContext, useEffect, useRef, useCallback, useState } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { EditorCarouselContext } from '../editor-context';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import { useEmblaResizeObserver } from '../hooks/useEmblaResizeObserver';
import { useEmblaQueryLoopObserver } from '../hooks/useEmblaQueryLoopObserver';

const EMBLA_KEY = Symbol.for( 'carousel-system.carousel' );

/**
 * Delay before re-measuring Embla after initial mount.
 * Wide/Full alignment CSS and the editor sidebar may not have settled
 * when `init()` first runs, so we defer a `reInit()` to pick up the
 * final viewport width.
 */
const LAYOUT_SETTLE_MS = 150;

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

	/**
	 * Single store subscription for slide count, IDs, and which slide (if any)
	 * is currently selected — including nested child-block selection.
	 */
	const { slideCount, selectedSlideIndex } = useSelect(
		( select ) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const s = select( 'core/block-editor' ) as any;
			const blocks: Array<{ clientId: string }> = s.getBlocks( clientId );
			const ids = blocks.map( ( b ) => b.clientId );
			const count = ids.length;

			const selectedId: string | null = s.getSelectedBlockClientId();
			let index = -1;
			if ( selectedId ) {
				index = ids.indexOf( selectedId );
				if ( index === -1 ) {
					const parents: string[] = s.getBlockParents( selectedId );
					const parentSlideId = parents.find( ( id ) => ids.includes( id ) );
					if ( parentSlideId ) {
						index = ids.indexOf( parentSlideId );
					}
				}
			}

			return { slideCount: count, selectedSlideIndex: index };
		},
		[ clientId ],
	);

	const hasSlides = slideCount > 0;

	const emblaRef = useRef<HTMLDivElement>( null );
	const emblaApiRef = useRef<EmblaCarouselType | undefined>();
	const initEmblaRef = useRef<() => void>();
	const ref = useMergeRefs( [ emblaRef, blockProps.ref ] );

	const { insertBlock } = useDispatch( 'core/block-editor' );

	// viewportEl is state so it triggers hook setup after the DOM mounts.
	// initEmblaRef is a ref so the MutationObserver callback always reads
	// the latest init function without re-subscribing.
	const [ viewportEl, setViewportEl ] = useState<HTMLDivElement | null>( null );

	useEmblaResizeObserver( viewportEl, emblaApiRef );
	useEmblaQueryLoopObserver( viewportEl, initEmblaRef );

	const addSlide = useCallback( () => {
		const block = createBlock( 'carousel-kit/carousel-slide' );
		insertBlock( block, undefined, clientId );
	}, [ insertBlock, clientId ] );

	const EmptyAppender = useCallback(
		() => (
			<div className="carousel-kit-viewport-empty">
				<Button variant="primary" icon={ plus } onClick={ addSlide }>
					{ __( 'Add Slide', 'carousel-kit' ) }
				</Button>
			</div>
		),
		[ addSlide ],
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'embla__container',
			style: {
				height: carouselOptions?.axis === 'y' ? 'auto' : undefined,
				minHeight: carouselOptions?.axis === 'y' ? '100%' : undefined,
				flexDirection: ( carouselOptions?.axis === 'y' ? 'column' : 'row' ) as React.CSSProperties[ 'flexDirection' ],
			},
		},
		{
			orientation: carouselOptions?.axis === 'y' ? 'vertical' : 'horizontal',
			allowedBlocks: [ 'carousel-kit/carousel-slide', 'core/query' ],
			renderAppender: ! hasSlides ? EmptyAppender : undefined,
		},
	);

	useEffect( () => {
		if ( emblaApiRef.current ) {
			// Defer until after React's commit phase so the new slide DOM is ready.
			setTimeout( () => emblaApiRef.current?.reInit(), 0 );
		}
	}, [ slideCount ] );

	/**
	 * Scroll Embla to the selected slide when the user picks a slide from the
	 * Block Tree (List View) or when a block inside a slide is selected.
	 *
	 * Deferred with rAF because Gutenberg's own scrollIntoView fires
	 * synchronously on selection, setting native scrollLeft on the viewport.
	 * Our scroll-reset listener (see main init effect) clears that, and then
	 * this rAF fires Embla's transform-based scroll.
	 */
	useEffect( () => {
		if ( selectedSlideIndex < 0 ) {
			return;
		}
		const id = requestAnimationFrame( () => {
			const api = emblaApiRef.current;
			if ( api && api.selectedScrollSnap() !== selectedSlideIndex ) {
				api.scrollTo( selectedSlideIndex );
			}
		} );
		return () => cancelAnimationFrame( id );
	}, [ selectedSlideIndex ] );

	/**
	 * Core Embla initialisation effect.
	 * Observer logic (resize + mutation) has been moved to dedicated hooks
	 * to keep this effect focused on Embla lifecycle only.
	 */
	useEffect( () => {
		if ( ! emblaRef.current ) {
			return;
		}

		const viewport = emblaRef.current;
		let embla: EmblaCarouselType | undefined;

		const init = () => {
			if ( embla ) {
				embla.destroy();
			}

			const queryLoopContainer = viewport.querySelector(
				'.wp-block-post-template',
			) as HTMLElement;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const options = carouselOptions as any;

			embla = EmblaCarousel( viewport, {
				loop: options?.loop ?? false,
				dragFree: options?.dragFree ?? false,
				containScroll: options?.containScroll || 'trimSnaps',
				axis: options?.axis || 'x',
				align: options?.align || 'start',
				direction: options?.direction || 'ltr',
				slidesToScroll: options?.slidesToScroll || 1,
				container: queryLoopContainer || undefined,
				watchDrag: false, // Clicks in slide gaps must not trigger Embla scroll in the editor.
				watchSlides: false, // Gutenberg injects block UI nodes into .embla__container; Embla's built-in MutationObserver would call reInit() on those, corrupting slide order and transforms.
				watchResize: false, // Replaced by a manual debounced ResizeObserver in useEmblaResizeObserver.
			} );

			( viewport as { [EMBLA_KEY]?: typeof embla } )[ EMBLA_KEY ] = embla;
			emblaApiRef.current = embla;

			const onSelect = () => {
				setCanScrollPrev( embla!.canScrollPrev() );
				setCanScrollNext( embla!.canScrollNext() );
			};

			embla.on( 'select', onSelect );
			embla.on( 'reInit', onSelect );

			requestAnimationFrame( () => {
				onSelect();
			} );

			setEmblaApi( embla );
		};

		// Run initial setup.
		init();

		// Re-measure once the editor layout has stabilised (e.g. Wide/Full
		// alignment CSS may not have been applied yet when init() ran).
		const layoutTimer = setTimeout( () => embla?.reInit(), LAYOUT_SETTLE_MS );

		// Keep ref in sync so observer hooks always call the latest init.
		initEmblaRef.current = init;

		// Expose viewport element to observer hooks (triggers their setup once).
		setViewportEl( viewport );

		/**
		 * Prevent native scroll offsets from corrupting Embla transforms.
		 * Gutenberg's scrollIntoView (triggered by List View / Block Tree
		 * selection) sets scrollLeft/scrollTop on the overflow:hidden viewport.
		 * Embla assumes these are always 0, so we reset them immediately.
		 */
		const resetNativeScroll = () => {
			if ( viewport.scrollLeft !== 0 ) {
				viewport.scrollLeft = 0;
			}
			if ( viewport.scrollTop !== 0 ) {
				viewport.scrollTop = 0;
			}
		};

		viewport.addEventListener( 'scroll', resetNativeScroll );

		return () => {
			clearTimeout( layoutTimer );
			viewport.removeEventListener( 'scroll', resetNativeScroll );
			embla?.destroy();
			emblaApiRef.current = undefined;
			delete ( viewport as { [EMBLA_KEY]?: typeof embla } )[ EMBLA_KEY ];
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
