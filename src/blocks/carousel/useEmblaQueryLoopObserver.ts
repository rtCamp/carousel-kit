import { useEffect } from '@wordpress/element';

/**
 * Watches for Query Loop (`.wp-block-post-template`) mutations inside the
 * viewport and calls the latest `initEmbla` function when detected.
 *
 * `initEmblaRef` is a ref so the MutationObserver callback always reads the
 * latest function without needing to tear down and re-subscribe whenever
 * `carouselOptions` changes.
 */
export function useEmblaQueryLoopObserver(
	viewportEl: HTMLDivElement | null,
	initEmblaRef: React.RefObject<( () => void ) | undefined>,
) {
	useEffect( () => {
		if ( ! viewportEl ) {
			return;
		}

		const mutationObserver = new MutationObserver( ( mutations ) => {
			let shouldReInit = false;

			for ( const mutation of mutations ) {
				const target = mutation.target as HTMLElement;

				if ( target.classList.contains( 'wp-block-post-template' ) ) {
					shouldReInit = true;
					break;
				}

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
				setTimeout( () => initEmblaRef.current?.(), 10 );
			}
		} );

		mutationObserver.observe( viewportEl, {
			childList: true,
			subtree: true,
		} );

		return () => mutationObserver.disconnect();
	}, [ viewportEl, initEmblaRef ] );
}
