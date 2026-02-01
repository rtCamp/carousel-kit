import { store, getContext, getElement } from '@wordpress/interactivity';
import EmblaCarousel, {
	type EmblaOptionsType,
	type EmblaCarouselType,
} from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { CarouselContext } from './types';

type ElementWithRef = {
	ref?: HTMLElement | null;
};

const EMBLA_KEY = Symbol.for( 'core-carousel.carousel' );

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
	const wrapper = element.closest( '.core-carousel' );
	const viewport = wrapper?.querySelector(
		'.embla',
	) as EmblaViewportElement | null;
	if ( ! viewport ) {
		return null;
	}
	// EMBLA_KEY is optional, so check if it exists
	return emblaInstances.get( viewport ) || viewport[ EMBLA_KEY ] || null;
};

store( 'core-carousel/carousel', {
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
			const element = getElementRef( getElement() );
			const embla = getEmblaFromElement( element );

			if ( embla && snap && typeof snap.index === 'number' ) {
				embla.scrollTo( snap.index );
			}
		},
	},
	callbacks: {
		isSlideActive: () => {
			const { selectedIndex } = getContext<CarouselContext>();
			const element = getElementRef( getElement() );
			// Check for either standard slide or Query Loop post
			const slide = element?.closest?.( '.embla__slide, .wp-block-post' );

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

				const viewport = element.querySelector(
					'.embla',
				);

				if ( ! viewport ) {
					// eslint-disable-next-line no-console
					console.warn( 'Carousel: Viewport (.embla) not found' );
					return;
				}

				// Check for Query Loop container
				const queryLoopContainer = viewport.querySelector(
					'.wp-block-post-template',
				);

				let cleanupEmbla: ( () => void ) | undefined;
				let observer: ResizeObserver | undefined;

				const startEmbla = () => {
					const rawOptions: EmblaOptionsType = context.options || {};

					// Sanitize options to prevent Embla crashes
					const options: EmblaOptionsType = {
						...rawOptions,
						align: ( [ 'start', 'center', 'end' ].includes(
							rawOptions.align as string,
						)
							? rawOptions.align
							: 'start' ) as any,
						containScroll: ( [ 'trimSnaps', 'keepSnaps', '' ].includes(
							rawOptions.containScroll as string,
						)
							? rawOptions.containScroll
							: 'trimSnaps' ) as any,
						direction: ( [ 'ltr', 'rtl' ].includes(
						rawOptions.direction as string,
						)
							? rawOptions.direction
							: 'ltr' ) as any,
						slidesToScroll: rawOptions.slidesToScroll === 'auto'
							? 'auto'
							: ( typeof rawOptions.slidesToScroll === 'number' && rawOptions.slidesToScroll > 0
								? rawOptions.slidesToScroll
								: 1 ),
						container: queryLoopContainer || null,
					};

					const plugins = [];

					if ( context.autoplay ) {
						plugins.push( Autoplay( context.autoplay as any ) );
					}

					const embla = EmblaCarousel( viewport, options, plugins );

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

				if ( viewport.getBoundingClientRect().width > 0 ) {
					cleanupEmbla = startEmbla();
				} else {
					observer = new ResizeObserver( ( entries ) => {
						for ( const entry of entries ) {
							if ( entry.contentRect.width > 0 ) {
								cleanupEmbla = startEmbla();
								observer?.disconnect();
								observer = undefined;
								break;
							}
						}
					} );
					observer.observe( viewport );
				}

				return () => {
					observer?.disconnect();
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
