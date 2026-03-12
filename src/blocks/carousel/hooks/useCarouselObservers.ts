import { useEffect } from '@wordpress/element';
import type { EmblaCarouselType } from 'embla-carousel';

const RESIZE_DEBOUNCE_MS = 200;
const MUTATION_DEBOUNCE_MS = 150;

/**
 * Unified observer hook that handles both resize detection and Query Loop
 * DOM mutations through a single coordinated MutationObserver.
 *
 * **Resize detection** (viewport + first slide width changes):
 * Uses `reInit()` because resize only affects measurements — the DOM structure
 * (container + slides) remains unchanged, so Embla's cached references stay valid.
 *
 * **Query Loop detection** (slide count changes):
 * Uses full destroy/recreate via `initEmblaRef` because Query Loop changes can
 * replace the `.wp-block-post-template` element or swap out its children entirely.
 * Embla caches references to container and slide elements, so when those DOM
 * nodes are replaced, a fresh instance is required.
 *
 * @param {HTMLDivElement | null}                                 viewportEl   - The carousel viewport element to observe
 * @param {React.MutableRefObject<EmblaCarouselType | undefined>} emblaRef     - Ref to the Embla instance for calling reInit()
 * @param {React.RefObject<(() => void) | undefined>}             initEmblaRef - Ref to the init function for full Embla recreate
 */
export function useCarouselObservers(
	viewportEl: HTMLDivElement | null,
	emblaRef: React.MutableRefObject<EmblaCarouselType | undefined>,
	initEmblaRef: React.RefObject<( () => void ) | undefined>,
) {
	useEffect( () => {
		if ( ! viewportEl ) {
			return;
		}

		let resizeTimer: ReturnType<typeof setTimeout> | undefined;
		let mutationTimer: ReturnType<typeof setTimeout> | undefined;

		// When a full init is in progress, suppress any resize-triggered reInits
		// that fire due to DOM churn during the init itself.
		let fullInitPending = false;

		const lastWidths = new WeakMap<Element, number>();
		let lastSlideCount = 0;
		let observedSlide: Element | null = null;

		const resizeObserver = new ResizeObserver( ( entries ) => {
			if ( fullInitPending ) {
				return;
			}

			let shouldReInit = false;

			for ( const entry of entries ) {
				const el = entry.target;
				const newWidth = entry.contentRect.width;
				const previousWidth = lastWidths.get( el );

				lastWidths.set( el, newWidth );

				// Skip first observation — establish baseline width.
				if ( previousWidth === undefined ) {
					continue;
				}

				if ( Math.abs( newWidth - previousWidth ) > 1 ) {
					shouldReInit = true;
				}
			}

			if ( shouldReInit ) {
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( () => {
					emblaRef.current?.reInit();
				}, RESIZE_DEBOUNCE_MS );
			}
		} );

		resizeObserver.observe( viewportEl );

		const updateSlideObservation = () => {
			const container = viewportEl.querySelector( '.embla__container, .wp-block-post-template' );
			const firstSlide = container?.querySelector( '.embla__slide, .wp-block-post' ) ?? null;

			if ( firstSlide === observedSlide ) {
				return;
			}

			if ( observedSlide ) {
				resizeObserver.unobserve( observedSlide );
			}

			if ( firstSlide ) {
				observedSlide = firstSlide;
				resizeObserver.observe( firstSlide );
			} else {
				observedSlide = null;
			}
		};

		const checkQueryLoopChanges = (): boolean => {
			const postTemplate = viewportEl.querySelector( '.wp-block-post-template' );
			const currentCount = postTemplate ? postTemplate.children.length : 0;

			const changed = currentCount !== lastSlideCount;
			lastSlideCount = currentCount;

			if ( changed && currentCount === 0 ) {
				// Template removed or emptied — destroy to avoid stale references.
				emblaRef.current?.destroy();
				emblaRef.current = undefined;
				return false;
			}

			return changed && currentCount > 0;
		};

		const processMutations = () => {
			const needsFullInit = checkQueryLoopChanges();

			if ( needsFullInit ) {
				clearTimeout( resizeTimer );
				fullInitPending = true;

				initEmblaRef.current?.();

				// Keep the flag set for the full resize debounce window so any
				// ResizeObserver callbacks from the init DOM churn are suppressed.
				// Reuses resizeTimer so the cleanup in the return handles it automatically.
				resizeTimer = setTimeout( () => {
					fullInitPending = false;
				}, RESIZE_DEBOUNCE_MS );
			}

			updateSlideObservation();
		};

		const mutationObserver = new MutationObserver( () => {
			clearTimeout( mutationTimer );
			mutationTimer = setTimeout( processMutations, MUTATION_DEBOUNCE_MS );
		} );

		mutationObserver.observe( viewportEl, { childList: true, subtree: true } );

		// Seed the initial slide count so the first mutation doesn't trigger a spurious init.
		const initialTemplate = viewportEl.querySelector( '.wp-block-post-template' );
		lastSlideCount = initialTemplate ? initialTemplate.children.length : 0;

		updateSlideObservation();

		return () => {
			clearTimeout( resizeTimer );
			clearTimeout( mutationTimer );
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [ viewportEl, emblaRef, initEmblaRef ] );
}
