import { useEffect } from '@wordpress/element';

/**
 * How long to wait after a DOM mutation before re-initialising Embla.
 * Gutenberg often fires multiple mutations in quick succession as posts render,
 * so we debounce to avoid re-initialising on an incomplete state.
 */
const QUERY_LOOP_DEBOUNCE_MS = 150;

/**
 * Observes DOM mutations inside the carousel viewport and re-initialises Embla
 * whenever the number of slides changes.
 *
 * Uses a ref for `initEmbla` so the observer always calls the latest version
 * without needing to re-subscribe when carousel options change.
 */
export function useEmblaQueryLoopObserver(
	viewportEl: HTMLDivElement | null,
	initEmblaRef: React.RefObject< ( () => void ) | undefined >,
) {
	useEffect( () => {
		if ( ! viewportEl ) {
			return;
		}

		let lastSlideCount = 0;
		let debounceTimer: ReturnType< typeof setTimeout > | undefined;

		const syncIfChanged = () => {
			const postTemplate = viewportEl.querySelector(
				'.wp-block-post-template',
			);
			const currentCount = postTemplate
				? postTemplate.children.length
				: 0;

			if ( currentCount !== lastSlideCount && currentCount > 0 ) {
				lastSlideCount = currentCount;
				initEmblaRef.current?.();
			}
		};

		const mutationObserver = new MutationObserver( () => {
			// Debounce to handle Gutenberg's rapid successive mutations.
			clearTimeout( debounceTimer );
			debounceTimer = setTimeout( syncIfChanged, QUERY_LOOP_DEBOUNCE_MS );
		} );

		mutationObserver.observe( viewportEl, {
			childList: true,
			subtree: true,
		} );

		// Seed the initial count so the first mutation doesn't trigger a spurious reInit.
		const initialTemplate = viewportEl.querySelector(
			'.wp-block-post-template',
		);
		lastSlideCount = initialTemplate
			? initialTemplate.children.length
			: 0;

		return () => {
			clearTimeout( debounceTimer );
			mutationObserver.disconnect();
		};
	}, [ viewportEl, initEmblaRef ] );
}
