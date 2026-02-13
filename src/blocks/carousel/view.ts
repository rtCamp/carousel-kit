import { store, getContext, getElement } from '@wordpress/interactivity';
import EmblaCarousel, {
	type EmblaOptionsType,
	type EmblaCarouselType,
} from 'embla-carousel';
import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';
import type { CarouselContext } from './types';

type ElementWithRef = {
	ref?: HTMLElement | null;
};

const EMBLA_KEY = Symbol.for( 'carousel-kit.carousel' );

type EmblaViewportElement = HTMLElement & {
	[EMBLA_KEY]?: EmblaCarouselType;
};

export const emblaInstances = new WeakMap<HTMLElement, EmblaCarouselType>();

const getElementRef = ( rawElement: unknown ): HTMLElement | null => {
	if ( rawElement instanceof HTMLElement ) {
		return rawElement;
	}
	if ( rawElement && typeof rawElement === 'object' && 'ref' in rawElement ) {
		const { ref } = rawElement as ElementWithRef;
		return ref ?? null;
	}
	return null;
};

const getEmblaFromElement = (
	element: HTMLElement | null,
): EmblaCarouselType | null => {
	if ( ! element ) {
		return null;
	}
	const wrapper = element.closest( '.carousel-kit' );
	const viewport = wrapper?.querySelector(
		'.embla',
	) as EmblaViewportElement | null;
	if ( ! viewport ) {
		return null;
	}
	// EMBLA_KEY is optional, so check if it exists
	return emblaInstances.get( viewport ) || viewport[ EMBLA_KEY ] || null;
};

store( 'carousel-kit/carousel', {
	state: {
		get canScrollPrev() {
			const context = getContext<CarouselContext>();
			return context.canScrollPrev;
		},
		get canScrollNext() {
			const context = getContext<CarouselContext>();
			return context.canScrollNext;
		},
	},
	actions: {
		scrollPrev: () => {
			const element = getElementRef( getElement() );
			const embla = getEmblaFromElement( element );
			if ( embla ) {
				embla.scrollPrev();
			} else {
				// eslint-disable-next-line no-console
				console.warn( 'Carousel: Embla instance not found for scrollPrev' );
			}
		},
		scrollNext: () => {
			const element = getElementRef( getElement() );
			const embla = getEmblaFromElement( element );
			if ( embla ) {
				embla.scrollNext();
			} else {
				// eslint-disable-next-line no-console
				console.warn( 'Carousel: Embla instance not found for scrollNext' );
			}
		},
		onDotClick: () => {
			const context = getContext<CarouselContext>();
			const { snap } = context as CarouselContext & {
				snap?: { index?: number };
			}; // snap is the iterated item

			if ( snap && typeof snap.index === 'number' ) {
				const element = getElementRef( getElement() );
				const embla = getEmblaFromElement( element );
				if ( embla ) {
					embla.scrollTo( snap.index );
				}
			}
		},
	},
	callbacks: {
		isSlideActive: () => {
			// Check for either standard slide or Query Loop post
			const slide = getElementRef( getElement() )?.closest?.(
				'.embla__slide, .wp-block-post',
			);

			if ( ! slide || ! slide.parentElement ) {
				return false;
			}

			// Filter siblings to find index among valid slides
			const slides = Array.from( slide.parentElement.children ).filter(
				( child: Element ) =>
					child.classList?.contains( 'embla__slide' ) ||
					child.classList?.contains( 'wp-block-post' ),
			);

			const index = slides.indexOf( slide );
			if ( index === -1 ) {
				return false;
			}
			const { selectedIndex } = getContext<CarouselContext>();
			return selectedIndex === index;
		},
		isDotActive: () => {
			const context = getContext<CarouselContext>();
			const { snap } = context as CarouselContext & {
				snap?: { index?: number };
			};
			return context.selectedIndex === snap?.index;
		},
		getDotLabel: () => {
			const context = getContext<CarouselContext>();
			const { snap } = context as CarouselContext & {
				snap?: { index?: number };
			};
			const index = ( snap?.index || 0 ) + 1;
			return context.ariaLabelPattern.replace( '%d', index.toString() );
		},
		initCarousel: () => {
			try {
				const context = getContext<CarouselContext>();
				const element = getElementRef( getElement() );

				if ( ! element || typeof element.querySelector !== 'function' ) {
					// eslint-disable-next-line no-console
					console.warn( 'Carousel: Invalid root element', element );
					return;
				}

				const viewport = element.querySelector( '.embla' );

				if ( ! viewport ) {
					// eslint-disable-next-line no-console
					console.warn( 'Carousel: Viewport (.embla) not found' );
					return;
				}

				// Check for Query Loop container
				const queryLoopContainer = viewport.querySelector(
					'.wp-block-post-template',
				);

				const startEmbla = () => {
					const rawOptions: EmblaOptionsType = context.options || {};

					// Sanitize options to prevent Embla crashes
					const align = [ 'start', 'center', 'end' ].includes(
						rawOptions.align as string,
					)
						? ( rawOptions.align as 'start' | 'center' | 'end' )
						: 'start';

					const containScroll = [ 'trimSnaps', 'keepSnaps', '' ].includes(
						rawOptions.containScroll as string,
					)
						? ( rawOptions.containScroll as 'trimSnaps' | 'keepSnaps' | '' )
						: 'trimSnaps';

					const direction = [ 'ltr', 'rtl' ].includes(
						rawOptions.direction as string,
					)
						? ( rawOptions.direction as 'ltr' | 'rtl' )
						: 'ltr';

					let slidesToScroll: EmblaOptionsType['slidesToScroll'] = 1;
					if ( rawOptions.slidesToScroll === 'auto' ) {
						slidesToScroll = 'auto';
					} else if (
						typeof rawOptions.slidesToScroll === 'number' &&
						rawOptions.slidesToScroll > 0
					) {
						slidesToScroll = rawOptions.slidesToScroll;
					}

					const options: EmblaOptionsType = {
						...rawOptions,
						align,
						containScroll,
						direction,
						slidesToScroll,
						container: queryLoopContainer || null,
					};

					const plugins = [];

					if ( context.autoplay ) {
						plugins.push( Autoplay( context.autoplay as AutoplayOptionsType ) );
					}

					const embla = EmblaCarousel(
						viewport as HTMLElement,
						options,
						plugins,
					);

					emblaInstances.set( viewport, embla );
					viewport[ EMBLA_KEY ] = embla;

					const updateState = () => {
						context.canScrollPrev = embla.canScrollPrev();
						context.canScrollNext = embla.canScrollNext();
						context.selectedIndex = embla.selectedScrollSnap();
						context.scrollSnaps = embla
							.scrollSnapList()
							.map( ( _, index ) => ( { index } ) );
					};

					embla.on( 'select', updateState );
					embla.on( 'reInit', updateState );

					// Autoplay API Integration
					embla.on( 'autoplay:timerset', () => {
						context.isPlaying = true;
						context.timerIterationId = ( context.timerIterationId || 0 ) + 1;
					} );

					embla.on( 'autoplay:timerstopped', () => {
						context.isPlaying = false;
					} );

					updateState();

					return () => {
						embla.destroy();
						emblaInstances.delete( viewport );
						delete viewport[ EMBLA_KEY ];
					};
				};

				let cleanupEmbla: ( () => void ) | undefined;
				let resizeObserver: ResizeObserver | undefined;
				let intersectionObserver: IntersectionObserver | undefined;

				const init = () => {
					if ( viewport.getBoundingClientRect().width > 0 ) {
						cleanupEmbla = startEmbla();
					} else {
						resizeObserver = new ResizeObserver( ( entries ) => {
							for ( const entry of entries ) {
								if ( entry.contentRect.width > 0 ) {
									cleanupEmbla = startEmbla();
									resizeObserver?.disconnect();
									resizeObserver = undefined;
									break;
								}
							}
						} );
						resizeObserver.observe( viewport );
					}
				};

				if ( 'IntersectionObserver' in window ) {
					intersectionObserver = new IntersectionObserver(
						( entries ) => {
							if ( entries[ 0 ].isIntersecting ) {
								init();
								intersectionObserver?.disconnect();
								intersectionObserver = undefined;
							}
						},
						{ rootMargin: '200px' },
					);
					intersectionObserver.observe( viewport );
				} else {
					init();
				}

				return () => {
					resizeObserver?.disconnect();
					intersectionObserver?.disconnect();
					cleanupEmbla?.();
				};
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.error( 'Carousel: Error in initCarousel', e );

				return null;
			}
		},
	},
} );
