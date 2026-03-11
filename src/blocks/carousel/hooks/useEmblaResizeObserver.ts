import { useEffect } from '@wordpress/element';
import type { EmblaCarouselType } from 'embla-carousel';

/**
 * How long to wait after a resize event before re-initialising Embla.
 * Debouncing avoids unnecessary reInits during continuous resize gestures.
 */
const RESIZE_DEBOUNCE_MS = 200;

/**
 * How long to wait after a DOM mutation before checking for new slides.
 * Shorter than resize debounce since we're just checking element existence.
 */
const MUTATION_DEBOUNCE_MS = 50;

/**
 * Observes width changes on both the viewport and the first slide, and
 * re-initialises Embla when a meaningful resize is detected (>1px change).
 *
 * - Viewport width changes occur on alignment changes (wide/full/none)
 * - Slide width changes occur on column style changes (2/3/4 columns)
 *
 * Uses Embla's non-destructive `reInit()` because resize only affects
 * measurements and scroll positions — the DOM structure remains unchanged.
 *
 * @param {HTMLDivElement | null}                                 viewportEl - The carousel viewport element to observe
 * @param {React.MutableRefObject<EmblaCarouselType | undefined>} emblaRef   - Ref to the Embla instance for calling reInit()
 */
export function useEmblaResizeObserver(
	viewportEl: HTMLDivElement | null,
	emblaRef: React.MutableRefObject<EmblaCarouselType | undefined>,
) {
	useEffect( () => {
		if ( ! viewportEl ) {
			return;
		}

		let resizeTimer: ReturnType<typeof setTimeout> | undefined;
		let mutationTimer: ReturnType<typeof setTimeout> | undefined;
		// Track widths per element to detect meaningful changes
		const lastWidths = new WeakMap<Element, number>();

		const resizeObserver = new ResizeObserver( ( entries ) => {
			let shouldReInit = false;

			// Process ALL entries to keep width tracking accurate.
			// We observe at most 2 elements (viewport + first slide), so this is trivially cheap.
			for ( const entry of entries ) {
				const el = entry.target;
				const newWidth = entry.contentRect.width;
				const previousWidth = lastWidths.get( el );

				// Always track the latest width.
				lastWidths.set( el, newWidth );

				// Skip first observation for this element — establish baseline.
				if ( previousWidth === undefined ) {
					continue;
				}

				// Trigger reInit if any observed element changed significantly.
				if ( Math.abs( newWidth - previousWidth ) > 1 ) {
					shouldReInit = true;
				}
			}

			if ( shouldReInit ) {
				// Debounce to batch rapid resize events.
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( () => {
					emblaRef.current?.reInit();
				}, RESIZE_DEBOUNCE_MS );
			}
		} );

		// Observe viewport for alignment changes (wide/full/none)
		resizeObserver.observe( viewportEl );

		// Track which slide we're currently observing to avoid duplicate observations
		let observedSlide: Element | null = null;

		// Observe first slide for column style changes (2/3/4 columns)
		const observeFirstSlide = () => {
			const container = viewportEl.querySelector( '.embla__container, .wp-block-post-template' );
			const firstSlide = container?.querySelector( '.embla__slide, .wp-block-post' ) ?? null;

			// If the first slide hasn't changed, there's nothing to do.
			if ( firstSlide === observedSlide ) {
				return;
			}

			// If we were observing a previous slide, stop observing it.
			if ( observedSlide ) {
				resizeObserver.unobserve( observedSlide );
			}

			// If a new first slide exists, start observing it; otherwise clear the reference.
			if ( firstSlide ) {
				observedSlide = firstSlide;
				resizeObserver.observe( firstSlide );
			} else {
				observedSlide = null;
			}
		};

		// Initial observation
		observeFirstSlide();

		// Re-observe when DOM changes. Use subtree:true to catch Query Loop
		// rendering posts asynchronously (the .wp-block-post-template may not
		// exist at initial setup). Debounced to avoid excessive calls from
		// Gutenberg's frequent DOM mutations (typing, block UI updates, etc.).
		const mutationObserver = new MutationObserver( () => {
			clearTimeout( mutationTimer );
			mutationTimer = setTimeout( observeFirstSlide, MUTATION_DEBOUNCE_MS );
		} );

		mutationObserver.observe( viewportEl, { childList: true, subtree: true } );

		return () => {
			clearTimeout( resizeTimer );
			clearTimeout( mutationTimer );
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [ viewportEl, emblaRef ] );
}
