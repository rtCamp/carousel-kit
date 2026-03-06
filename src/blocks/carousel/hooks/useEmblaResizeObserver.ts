import { useEffect } from '@wordpress/element';
import type { EmblaCarouselType } from 'embla-carousel';

/**
 * How long to wait after a resize event before re-initialising Embla.
 * Debouncing avoids unnecessary reInits during continuous resize gestures.
 */
const RESIZE_DEBOUNCE_MS = 200;

/**
 * Observes width changes on the carousel viewport and re-initialises Embla
 * when a meaningful resize is detected (more than 1px change).
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
		let lastWidth = viewportEl.getBoundingClientRect().width;

		const resizeObserver = new ResizeObserver( ( entries ) => {
			// Debounce to avoid reInit on every pixel change during a resize.
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( () => {
				const newWidth = entries[ 0 ]?.contentRect.width ?? 0;
				if ( Math.abs( newWidth - lastWidth ) > 1 && emblaRef.current ) {
					lastWidth = newWidth;
					emblaRef.current.reInit();
				}
			}, RESIZE_DEBOUNCE_MS );
		} );

		resizeObserver.observe( viewportEl );

		return () => {
			clearTimeout( resizeTimer );
			resizeObserver.disconnect();
		};
	}, [ viewportEl, emblaRef ] );
}
