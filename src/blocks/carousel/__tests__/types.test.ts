/**
 * Unit tests for the CarouselAttributes and CarouselContext type definitions.
 *
 * These tests verify:
 * - Type structures are correct and TypeScript compilation passes
 * - All valid values for union types are accepted
 * - Default and edge case values work correctly
 * - Optional properties behave as expected
 *
 * Note: These are compile-time type checks that also verify runtime behavior.
 *
 * @package Core_Carousel
 */

import type { CarouselAttributes, CarouselContext } from '../types';

describe( 'CarouselAttributes Type', () => {
	describe( 'Structure Validation', () => {
		it( 'should accept valid complete attributes', () => {
			const attributes: CarouselAttributes = {
				loop: true,
				dragFree: false,
				carouselAlign: 'center',
				containScroll: 'trimSnaps',
				direction: 'ltr',
				axis: 'x',
				height: '400px',
				allowedSlideBlocks: [ 'core/image', 'core/paragraph' ],
				autoplay: true,
				autoplayDelay: 5000,
				autoplayStopOnInteraction: true,
				autoplayStopOnMouseEnter: true,
				ariaLabel: 'Image carousel',
				slideGap: 16,
				slidesToScroll: '1',
			};

			expect( attributes ).toBeDefined();
			expect( attributes.loop ).toBe( true );
			expect( attributes.carouselAlign ).toBe( 'center' );
			expect( attributes.direction ).toBe( 'ltr' );
		} );

		it( 'should have all required properties', () => {
			const attributes: CarouselAttributes = {
				loop: false,
				dragFree: true,
				carouselAlign: 'start',
				containScroll: 'keepSnaps',
				direction: 'rtl',
				axis: 'y',
				height: '300px',
				allowedSlideBlocks: [],
				autoplay: false,
				autoplayDelay: 3000,
				autoplayStopOnInteraction: false,
				autoplayStopOnMouseEnter: false,
				ariaLabel: '',
				slideGap: 0,
				slidesToScroll: 'auto',
			};

			// Verify all keys exist
			const requiredKeys = [
				'loop',
				'dragFree',
				'carouselAlign',
				'containScroll',
				'direction',
				'axis',
				'height',
				'allowedSlideBlocks',
				'autoplay',
				'autoplayDelay',
				'autoplayStopOnInteraction',
				'autoplayStopOnMouseEnter',
				'ariaLabel',
				'slideGap',
				'slidesToScroll',
			];

			requiredKeys.forEach( ( key ) => {
				expect( attributes ).toHaveProperty( key );
			} );
		} );
	} );

	describe( 'Alignment Options', () => {
		it.each( [ 'start', 'center', 'end' ] as const )(
			'should accept carouselAlign value: %s',
			( align ) => {
				const attributes: Partial< CarouselAttributes > = {
					carouselAlign: align,
				};
				expect( attributes.carouselAlign ).toBe( align );
			}
		);

		it( 'should accept optional align property', () => {
			const withAlign: Partial< CarouselAttributes > = {
				align: 'center',
			};
			expect( withAlign.align ).toBe( 'center' );

			const withoutAlign: Partial< CarouselAttributes > = {};
			expect( withoutAlign.align ).toBeUndefined();
		} );
	} );

	describe( 'Scroll Containment', () => {
		it.each( [ 'trimSnaps', 'keepSnaps' ] as const )(
			'should accept containScroll value: %s',
			( value ) => {
				const attributes: Partial< CarouselAttributes > = {
					containScroll: value,
				};
				expect( attributes.containScroll ).toBe( value );
			}
		);
	} );

	describe( 'Direction and Axis', () => {
		it.each( [ 'ltr', 'rtl' ] as const )(
			'should accept direction value: %s',
			( direction ) => {
				const attributes: Partial< CarouselAttributes > = { direction };
				expect( attributes.direction ).toBe( direction );
			}
		);

		it.each( [ 'x', 'y' ] as const )(
			'should accept axis value: %s',
			( axis ) => {
				const attributes: Partial< CarouselAttributes > = { axis };
				expect( attributes.axis ).toBe( axis );
			}
		);
	} );

	describe( 'Autoplay Configuration', () => {
		it( 'should accept autoplay as boolean', () => {
			const enabled: Partial< CarouselAttributes > = { autoplay: true };
			const disabled: Partial< CarouselAttributes > = { autoplay: false };

			expect( enabled.autoplay ).toBe( true );
			expect( disabled.autoplay ).toBe( false );
		} );

		it( 'should accept valid autoplay delay values', () => {
			const delays = [ 0, 1000, 3000, 5000, 10000 ];

			delays.forEach( ( delay ) => {
				const attributes: Partial< CarouselAttributes > = {
					autoplayDelay: delay,
				};
				expect( attributes.autoplayDelay ).toBe( delay );
			} );
		} );
	} );

	describe( 'Slide Configuration', () => {
		it( 'should accept empty allowedSlideBlocks array', () => {
			const attributes: Partial< CarouselAttributes > = {
				allowedSlideBlocks: [],
			};
			expect( attributes.allowedSlideBlocks ).toHaveLength( 0 );
		} );

		it( 'should accept multiple block types in allowedSlideBlocks', () => {
			const blocks = [
				'core/image',
				'core/paragraph',
				'core/heading',
				'core/group',
				'core/columns',
			];

			const attributes: Partial< CarouselAttributes > = {
				allowedSlideBlocks: blocks,
			};

			expect( attributes.allowedSlideBlocks ).toHaveLength( 5 );
			expect( attributes.allowedSlideBlocks ).toContain( 'core/image' );
		} );

		it( 'should accept various slideGap values', () => {
			const gaps = [ 0, 8, 16, 24, 32 ];

			gaps.forEach( ( gap ) => {
				const attributes: Partial< CarouselAttributes > = {
					slideGap: gap,
				};
				expect( attributes.slideGap ).toBe( gap );
			} );
		} );

		it( 'should accept slidesToScroll as string', () => {
			const values = [ '1', '2', '3', 'auto' ];

			values.forEach( ( value ) => {
				const attributes: Partial< CarouselAttributes > = {
					slidesToScroll: value,
				};
				expect( attributes.slidesToScroll ).toBe( value );
			} );
		} );
	} );

	describe( 'Accessibility', () => {
		it( 'should accept various ariaLabel values', () => {
			const labels = [
				'Image carousel',
				'Product gallery',
				'Testimonial slider',
				'',
			];

			labels.forEach( ( label ) => {
				const attributes: Partial< CarouselAttributes > = {
					ariaLabel: label,
				};
				expect( attributes.ariaLabel ).toBe( label );
			} );
		} );
	} );

	describe( 'Dimension Configuration', () => {
		it( 'should accept various height values', () => {
			const heights = [ '100px', '400px', '50vh', '100%', 'auto' ];

			heights.forEach( ( height ) => {
				const attributes: Partial< CarouselAttributes > = { height };
				expect( attributes.height ).toBe( height );
			} );
		} );
	} );
} );

describe( 'CarouselContext Type', () => {
	describe( 'Autoplay State', () => {
		it( 'should accept context with autoplay disabled', () => {
			const context: CarouselContext = {
				options: {
					loop: false,
					align: 'start',
				},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [ { index: 0 }, { index: 1 } ],
				canScrollPrev: false,
				canScrollNext: true,
				ariaLabelPattern: 'Go to slide %d',
			};

			expect( context.autoplay ).toBe( false );
			expect( context.isPlaying ).toBe( false );
		} );

		it( 'should accept context with autoplay configuration object', () => {
			const context: CarouselContext = {
				options: {
					loop: true,
					align: 'center',
				},
				autoplay: {
					delay: 5000,
					stopOnInteraction: true,
					stopOnMouseEnter: false,
				},
				isPlaying: true,
				timerIterationId: 1,
				selectedIndex: 2,
				scrollSnaps: [ { index: 0 }, { index: 1 }, { index: 2 } ],
				canScrollPrev: true,
				canScrollNext: true,
				ariaLabelPattern: 'Slide %d of 3',
			};

			expect( context.autoplay ).not.toBe( false );
			expect( typeof context.autoplay ).toBe( 'object' );

			if ( typeof context.autoplay === 'object' ) {
				expect( context.autoplay.delay ).toBe( 5000 );
				expect( context.autoplay.stopOnInteraction ).toBe( true );
				expect( context.autoplay.stopOnMouseEnter ).toBe( false );
			}
		} );
	} );

	describe( 'Scroll State Management', () => {
		it( 'should track first slide state correctly', () => {
			const context: CarouselContext = {
				options: { loop: false },
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [ { index: 0 }, { index: 1 }, { index: 2 } ],
				canScrollPrev: false,
				canScrollNext: true,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.selectedIndex ).toBe( 0 );
			expect( context.canScrollPrev ).toBe( false );
			expect( context.canScrollNext ).toBe( true );
		} );

		it( 'should track middle slide state correctly', () => {
			const context: CarouselContext = {
				options: { loop: false },
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 1,
				scrollSnaps: [ { index: 0 }, { index: 1 }, { index: 2 } ],
				canScrollPrev: true,
				canScrollNext: true,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.selectedIndex ).toBe( 1 );
			expect( context.canScrollPrev ).toBe( true );
			expect( context.canScrollNext ).toBe( true );
		} );

		it( 'should track last slide state correctly', () => {
			const context: CarouselContext = {
				options: { loop: false },
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 2,
				scrollSnaps: [ { index: 0 }, { index: 1 }, { index: 2 } ],
				canScrollPrev: true,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.selectedIndex ).toBe( 2 );
			expect( context.canScrollPrev ).toBe( true );
			expect( context.canScrollNext ).toBe( false );
		} );

		it( 'should handle single slide carousel', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [ { index: 0 } ],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.scrollSnaps ).toHaveLength( 1 );
			expect( context.canScrollPrev ).toBe( false );
			expect( context.canScrollNext ).toBe( false );
		} );
	} );

	describe( 'Timer and Animation State', () => {
		it( 'should track timerIterationId for animation resets', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: { delay: 3000, stopOnInteraction: true, stopOnMouseEnter: false },
				isPlaying: true,
				timerIterationId: 5,
				selectedIndex: 0,
				scrollSnaps: [ { index: 0 } ],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.timerIterationId ).toBe( 5 );

			// Simulate slide change incrementing the ID
			const updatedContext = { ...context, timerIterationId: 6 };
			expect( updatedContext.timerIterationId ).toBe( 6 );
		} );

		it( 'should have initial timerIterationId of 0', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.timerIterationId ).toBe( 0 );
		} );
	} );

	describe( 'Optional Properties', () => {
		it( 'should include optional ref property when provided', () => {
			const element = document.createElement( 'div' );

			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
				ref: element,
			};

			expect( context.ref ).toBe( element );
			expect( context.ref ).toBeInstanceOf( HTMLElement );
		} );

		it( 'should allow null ref', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
				ref: null,
			};

			expect( context.ref ).toBeNull();
		} );

		it( 'should work without ref property', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.ref ).toBeUndefined();
		} );
	} );

	describe( 'Embla Options Integration', () => {
		it( 'should accept slidesToScroll as number in options', () => {
			const context: CarouselContext = {
				options: {
					loop: true,
					slidesToScroll: 2,
				},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.options.slidesToScroll ).toBe( 2 );
		} );

		it( 'should accept slidesToScroll as "auto" in options', () => {
			const context: CarouselContext = {
				options: {
					loop: true,
					slidesToScroll: 'auto',
				},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.options.slidesToScroll ).toBe( 'auto' );
		} );
	} );

	describe( 'ARIA Label Pattern', () => {
		it( 'should accept pattern with placeholder', () => {
			const patterns = [
				'Go to slide %d',
				'Slide %d of 10',
				'View item %d',
				'%d',
			];

			patterns.forEach( ( pattern ) => {
				const context: CarouselContext = {
					options: {},
					autoplay: false,
					isPlaying: false,
					timerIterationId: 0,
					selectedIndex: 0,
					scrollSnaps: [],
					canScrollPrev: false,
					canScrollNext: false,
					ariaLabelPattern: pattern,
				};

				expect( context.ariaLabelPattern ).toBe( pattern );
			} );
		} );
	} );

	describe( 'Scroll Snaps Array', () => {
		it( 'should accept empty scrollSnaps array', () => {
			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps: [],
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.scrollSnaps ).toHaveLength( 0 );
		} );

		it( 'should accept scrollSnaps with correct index structure', () => {
			const scrollSnaps = [
				{ index: 0 },
				{ index: 1 },
				{ index: 2 },
				{ index: 3 },
				{ index: 4 },
			];

			const context: CarouselContext = {
				options: {},
				autoplay: false,
				isPlaying: false,
				timerIterationId: 0,
				selectedIndex: 0,
				scrollSnaps,
				canScrollPrev: false,
				canScrollNext: false,
				ariaLabelPattern: 'Slide %d',
			};

			expect( context.scrollSnaps ).toHaveLength( 5 );
			context.scrollSnaps.forEach( ( snap, i ) => {
				expect( snap.index ).toBe( i );
			} );
		} );
	} );
} );
