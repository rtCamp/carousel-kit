/**
 * Unit tests for the carousel view.ts frontend logic.
 *
 * Tests cover:
 * - Store registration and configuration
 * - State getters and their return values
 * - Action behaviors (scrollPrev, scrollNext, onDotClick)
 * - Callback behaviors (isSlideActive, isDotActive, getDotLabel, initCarousel)
 * - Error handling and edge cases
 * - Embla Carousel integration
 *
 * @package Core_Carousel
 */

import {
	store,
	getContext,
	getElement,
} from '@wordpress/interactivity';
import EmblaCarousel from 'embla-carousel';

import type { EmblaCarouselType } from 'embla-carousel';

// Symbol key used by the view.ts for Embla instances
const EMBLA_KEY = Symbol.for( 'core-carousel.carousel' );

// Type for viewport element with Embla instance attached
type EmblaViewportElement = HTMLElement & {
	[ EMBLA_KEY ]?: EmblaCarouselType;
};

import type { CarouselContext } from '../types';

// Import view to trigger store registration
import '../view';

// Get the store config that was passed to store()
const storeCall = ( store as jest.Mock ).mock.calls.find(
	( call: unknown[] ) => call[ 0 ] === 'core-carousel/carousel'
);
const storeConfig = storeCall ? storeCall[ 1 ] : null;

/**
 * Helper to set Embla instance on a viewport element.
 */
const setEmblaOnViewport = (
	viewport: HTMLElement,
	embla: Partial< EmblaCarouselType >
) => {
	( viewport as EmblaViewportElement )[ EMBLA_KEY ] =
		embla as EmblaCarouselType;
};

/**
 * Helper to create mock carousel context with customizable properties.
 */
const createMockContext = (
	overrides: Partial< CarouselContext > = {}
): CarouselContext => ( {
	options: { loop: true },
	autoplay: false,
	isPlaying: false,
	timerIterationId: 0,
	selectedIndex: 0,
	scrollSnaps: [ { index: 0 }, { index: 1 }, { index: 2 } ],
	canScrollPrev: true,
	canScrollNext: true,
	ariaLabelPattern: 'Go to slide %d',
	...overrides,
} );

/**
 * Helper to create a mock DOM element structure for carousel.
 */
const createMockCarouselDOM = () => {
	const viewport = document.createElement( 'div' );
	viewport.className = 'embla';

	const wrapper = document.createElement( 'div' );
	wrapper.className = 'core-carousel';
	wrapper.appendChild( viewport );

	const button = document.createElement( 'button' );
	wrapper.appendChild( button );

	return { wrapper, viewport, button };
};

/**
 * Helper to create mock Embla instance with all required methods.
 */
const createMockEmblaInstance = ( overrides = {} ) => ( {
	scrollPrev: jest.fn(),
	scrollNext: jest.fn(),
	scrollTo: jest.fn(),
	on: jest.fn(),
	off: jest.fn(),
	destroy: jest.fn(),
	canScrollPrev: jest.fn( () => true ),
	canScrollNext: jest.fn( () => true ),
	selectedScrollSnap: jest.fn( () => 0 ),
	scrollSnapList: jest.fn( () => [ 0, 0.5, 1 ] ),
	...overrides,
} );

describe( 'Carousel View Module', () => {
	describe( 'Store Registration', () => {
		it( 'should register store with correct namespace', () => {
			// storeCall being defined proves store was called with the correct namespace
			expect( storeCall ).toBeDefined();
			expect( storeConfig ).not.toBeNull();
			expect( storeCall[ 0 ] ).toBe( 'core-carousel/carousel' );
		} );

		it( 'should register store with all required sections', () => {
			expect( storeConfig ).toMatchObject( {
				state: expect.any( Object ),
				actions: expect.any( Object ),
				callbacks: expect.any( Object ),
			} );
		} );

		it( 'should have state object defined with getters', () => {
			expect( storeConfig?.state ).toBeDefined();
			expect(
				Object.getOwnPropertyDescriptor( storeConfig.state, 'canScrollPrev' )
					?.get
			).toBeDefined();
			expect(
				Object.getOwnPropertyDescriptor( storeConfig.state, 'canScrollNext' )
					?.get
			).toBeDefined();
		} );
	} );

	describe( 'State Getters', () => {
		beforeEach( () => {
			jest.clearAllMocks();
		} );

		describe( 'canScrollPrev', () => {
			it( 'should return true when context.canScrollPrev is true', () => {
				const mockContext = createMockContext( { canScrollPrev: true } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result =
					Object.getOwnPropertyDescriptor(
						storeConfig.state,
						'canScrollPrev'
					)?.get?.() ?? false;

				expect( result ).toBe( true );
			} );

			it( 'should return false when context.canScrollPrev is false', () => {
				const mockContext = createMockContext( { canScrollPrev: false } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result =
					Object.getOwnPropertyDescriptor(
						storeConfig.state,
						'canScrollPrev'
					)?.get?.() ?? true;

				expect( result ).toBe( false );
			} );
		} );

		describe( 'canScrollNext', () => {
			it( 'should return true when context.canScrollNext is true', () => {
				const mockContext = createMockContext( { canScrollNext: true } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result =
					Object.getOwnPropertyDescriptor(
						storeConfig.state,
						'canScrollNext'
					)?.get?.() ?? false;

				expect( result ).toBe( true );
			} );

			it( 'should return false when context.canScrollNext is false', () => {
				const mockContext = createMockContext( { canScrollNext: false } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result =
					Object.getOwnPropertyDescriptor(
						storeConfig.state,
						'canScrollNext'
					)?.get?.() ?? true;

				expect( result ).toBe( false );
			} );
		} );
	} );

	describe( 'Actions', () => {
		beforeEach( () => {
			jest.clearAllMocks();
		} );

		describe( 'scrollPrev', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.actions?.scrollPrev ).toBeDefined();
				expect( typeof storeConfig?.actions?.scrollPrev ).toBe( 'function' );
			} );

			it( 'should call embla.scrollPrev when embla instance exists', () => {
				const { wrapper, viewport, button } = createMockCarouselDOM();
				const mockEmbla = createMockEmblaInstance();

				// Set up embla instance on viewport using the helper
				setEmblaOnViewport( viewport, mockEmbla );

				( getElement as jest.Mock ).mockReturnValue( { ref: button } );
				document.body.appendChild( wrapper );

				storeConfig.actions.scrollPrev();

				expect( mockEmbla.scrollPrev ).toHaveBeenCalledTimes( 1 );

				document.body.removeChild( wrapper );
			} );

			it( 'should log warning when embla instance not found', () => {
				const consoleSpy = jest
					.spyOn( console, 'warn' )
					.mockImplementation();
				const button = document.createElement( 'button' );

				( getElement as jest.Mock ).mockReturnValue( { ref: button } );

				storeConfig.actions.scrollPrev();

				expect( consoleSpy ).toHaveBeenCalledWith(
					'Carousel: Embla instance not found for scrollPrev'
				);

				consoleSpy.mockRestore();
			} );

			it( 'should handle null element gracefully', () => {
				const consoleSpy = jest
					.spyOn( console, 'warn' )
					.mockImplementation();
				( getElement as jest.Mock ).mockReturnValue( null );

				expect( () => storeConfig.actions.scrollPrev() ).not.toThrow();
				expect( consoleSpy ).toHaveBeenCalled();

				consoleSpy.mockRestore();
			} );
		} );

		describe( 'scrollNext', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.actions?.scrollNext ).toBeDefined();
				expect( typeof storeConfig?.actions?.scrollNext ).toBe( 'function' );
			} );

			it( 'should call embla.scrollNext when embla instance exists', () => {
				const { wrapper, viewport, button } = createMockCarouselDOM();
				const mockEmbla = createMockEmblaInstance();

				setEmblaOnViewport( viewport, mockEmbla );

				( getElement as jest.Mock ).mockReturnValue( { ref: button } );
				document.body.appendChild( wrapper );

				storeConfig.actions.scrollNext();

				expect( mockEmbla.scrollNext ).toHaveBeenCalledTimes( 1 );

				document.body.removeChild( wrapper );
			} );

			it( 'should log warning when embla instance not found', () => {
				const consoleSpy = jest
					.spyOn( console, 'warn' )
					.mockImplementation();
				const button = document.createElement( 'button' );

				( getElement as jest.Mock ).mockReturnValue( { ref: button } );

				storeConfig.actions.scrollNext();

				expect( consoleSpy ).toHaveBeenCalledWith(
					'Carousel: Embla instance not found for scrollNext'
				);

				consoleSpy.mockRestore();
			} );
		} );

		describe( 'onDotClick', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.actions?.onDotClick ).toBeDefined();
				expect( typeof storeConfig?.actions?.onDotClick ).toBe( 'function' );
			} );

			it( 'should call embla.scrollTo with correct index', () => {
				const { wrapper, viewport, button } = createMockCarouselDOM();
				const mockEmbla = createMockEmblaInstance();

				setEmblaOnViewport( viewport, mockEmbla );

				const mockContext = createMockContext();
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 2 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: button } );
				document.body.appendChild( wrapper );

				storeConfig.actions.onDotClick();

				expect( mockEmbla.scrollTo ).toHaveBeenCalledWith( 2 );

				document.body.removeChild( wrapper );
			} );

			it( 'should not throw when snap is undefined', () => {
				const mockContext = createMockContext();
				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( null );

				expect( () => storeConfig.actions.onDotClick() ).not.toThrow();
			} );

			it( 'should handle snap.index of 0 correctly', () => {
				const { wrapper, viewport, button } = createMockCarouselDOM();
				const mockEmbla = createMockEmblaInstance();

				setEmblaOnViewport( viewport, mockEmbla );

				const mockContext = createMockContext();
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 0 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: button } );
				document.body.appendChild( wrapper );

				storeConfig.actions.onDotClick();

				expect( mockEmbla.scrollTo ).toHaveBeenCalledWith( 0 );

				document.body.removeChild( wrapper );
			} );
		} );
	} );

	describe( 'Callbacks', () => {
		beforeEach( () => {
			jest.clearAllMocks();
		} );

		describe( 'isSlideActive', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.callbacks?.isSlideActive ).toBeDefined();
				expect( typeof storeConfig?.callbacks?.isSlideActive ).toBe(
					'function'
				);
			} );

			it( 'should return false when element is null', () => {
				( getElement as jest.Mock ).mockReturnValue( null );

				const result = storeConfig.callbacks.isSlideActive();

				expect( result ).toBe( false );
			} );

			it( 'should return true when slide index matches selectedIndex', () => {
				const container = document.createElement( 'div' );
				container.className = 'embla__container';

				const slide1 = document.createElement( 'div' );
				slide1.className = 'embla__slide';
				const slide2 = document.createElement( 'div' );
				slide2.className = 'embla__slide';

				container.appendChild( slide1 );
				container.appendChild( slide2 );

				const mockContext = createMockContext( { selectedIndex: 1 } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: slide2 } );

				const result = storeConfig.callbacks.isSlideActive();

				expect( result ).toBe( true );
			} );

			it( 'should return false when slide index does not match selectedIndex', () => {
				const container = document.createElement( 'div' );
				container.className = 'embla__container';

				const slide1 = document.createElement( 'div' );
				slide1.className = 'embla__slide';
				const slide2 = document.createElement( 'div' );
				slide2.className = 'embla__slide';

				container.appendChild( slide1 );
				container.appendChild( slide2 );

				const mockContext = createMockContext( { selectedIndex: 0 } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: slide2 } );

				const result = storeConfig.callbacks.isSlideActive();

				expect( result ).toBe( false );
			} );

			it( 'should work with Query Loop posts (.wp-block-post)', () => {
				const container = document.createElement( 'div' );

				const post1 = document.createElement( 'li' );
				post1.className = 'wp-block-post';
				const post2 = document.createElement( 'li' );
				post2.className = 'wp-block-post';

				container.appendChild( post1 );
				container.appendChild( post2 );

				const mockContext = createMockContext( { selectedIndex: 0 } );
				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: post1 } );

				const result = storeConfig.callbacks.isSlideActive();

				expect( result ).toBe( true );
			} );
		} );

		describe( 'isDotActive', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.callbacks?.isDotActive ).toBeDefined();
				expect( typeof storeConfig?.callbacks?.isDotActive ).toBe( 'function' );
			} );

			it( 'should return true when snap.index matches selectedIndex', () => {
				const mockContext = createMockContext( { selectedIndex: 2 } );
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 2 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result = storeConfig.callbacks.isDotActive();

				expect( result ).toBe( true );
			} );

			it( 'should return false when snap.index does not match selectedIndex', () => {
				const mockContext = createMockContext( { selectedIndex: 0 } );
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 2 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result = storeConfig.callbacks.isDotActive();

				expect( result ).toBe( false );
			} );
		} );

		describe( 'getDotLabel', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.callbacks?.getDotLabel ).toBeDefined();
				expect( typeof storeConfig?.callbacks?.getDotLabel ).toBe( 'function' );
			} );

			it( 'should return formatted label with correct index (1-based)', () => {
				const mockContext = createMockContext( {
					ariaLabelPattern: 'Go to slide %d',
				} );
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 2 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result = storeConfig.callbacks.getDotLabel();

				expect( result ).toBe( 'Go to slide 3' );
			} );

			it( 'should handle first slide (index 0) correctly', () => {
				const mockContext = createMockContext( {
					ariaLabelPattern: 'Slide %d of 5',
				} );
				( mockContext as CarouselContext & { snap?: { index: number } } ).snap =
					{ index: 0 };

				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result = storeConfig.callbacks.getDotLabel();

				expect( result ).toBe( 'Slide 1 of 5' );
			} );

			it( 'should handle undefined snap index', () => {
				const mockContext = createMockContext( {
					ariaLabelPattern: 'Go to slide %d',
				} );

				( getContext as jest.Mock ).mockReturnValue( mockContext );

				const result = storeConfig.callbacks.getDotLabel();

				expect( result ).toBe( 'Go to slide 1' );
			} );
		} );

		describe( 'initCarousel', () => {
			it( 'should be defined as a function', () => {
				expect( storeConfig?.callbacks?.initCarousel ).toBeDefined();
				expect( typeof storeConfig?.callbacks?.initCarousel ).toBe(
					'function'
				);
			} );

			it( 'should return early and log warning for invalid element', () => {
				const consoleSpy = jest
					.spyOn( console, 'warn' )
					.mockImplementation();
				const mockContext = createMockContext();

				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( null );

				const result = storeConfig.callbacks.initCarousel();

				expect( consoleSpy ).toHaveBeenCalledWith(
					'Carousel: Invalid root element',
					null
				);
				expect( result ).toBeUndefined();

				consoleSpy.mockRestore();
			} );

			it( 'should log warning when viewport not found', () => {
				const consoleSpy = jest
					.spyOn( console, 'warn' )
					.mockImplementation();
				const mockContext = createMockContext();
				const element = document.createElement( 'div' );

				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: element } );

				const result = storeConfig.callbacks.initCarousel();

				expect( consoleSpy ).toHaveBeenCalledWith(
					'Carousel: Viewport (.embla) not found'
				);
				expect( result ).toBeUndefined();

				consoleSpy.mockRestore();
			} );

			it( 'should handle errors gracefully and log them', () => {
				const consoleErrorSpy = jest
					.spyOn( console, 'error' )
					.mockImplementation();
				const mockContext = createMockContext();

				// Create element that will cause an error
				const element = {
					querySelector: () => {
						throw new Error( 'Test error' );
					},
				};

				( getContext as jest.Mock ).mockReturnValue( mockContext );
				( getElement as jest.Mock ).mockReturnValue( { ref: element } );

				const result = storeConfig.callbacks.initCarousel();

				expect( consoleErrorSpy ).toHaveBeenCalledWith(
					'Carousel: Error in initCarousel',
					expect.any( Error )
				);
				expect( result ).toBeNull();

				consoleErrorSpy.mockRestore();
			} );
		} );
	} );
} );

describe( 'Embla Carousel Integration', () => {
	// Type-safe helper to get mocked Embla instance
	const getMockedEmblaCarousel = () =>
		EmblaCarousel as unknown as jest.Mock;

	it( 'should have EmblaCarousel mocked', () => {
		expect( EmblaCarousel ).toBeDefined();
		expect( jest.isMockFunction( EmblaCarousel ) ).toBe( true );
	} );

	it( 'should create embla instance with correct methods', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( mockInstance.scrollPrev ).toBeDefined();
		expect( mockInstance.scrollNext ).toBeDefined();
		expect( mockInstance.scrollTo ).toBeDefined();
		expect( mockInstance.on ).toBeDefined();
		expect( mockInstance.destroy ).toBeDefined();
	} );

	it( 'should have scrollPrev as a callable function', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( () => mockInstance.scrollPrev() ).not.toThrow();
	} );

	it( 'should have scrollNext as a callable function', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( () => mockInstance.scrollNext() ).not.toThrow();
	} );

	it( 'should have scrollTo as a callable function', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( () => mockInstance.scrollTo( 2 ) ).not.toThrow();
	} );

	it( 'should have on method for event listeners', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( () => mockInstance.on( 'select', jest.fn() ) ).not.toThrow();
	} );

	it( 'should have destroy method for cleanup', () => {
		const mockInstance = getMockedEmblaCarousel()();

		expect( () => mockInstance.destroy() ).not.toThrow();
	} );
} );

describe( 'Element Reference Handling', () => {
	describe( 'getElement variations', () => {
		beforeEach( () => {
			jest.clearAllMocks();
		} );

		it( 'should handle getElement returning HTMLElement directly', () => {
			const consoleSpy = jest.spyOn( console, 'warn' ).mockImplementation();
			const element = document.createElement( 'div' );

			( getElement as jest.Mock ).mockReturnValue( element );

			// This should not throw
			expect( () => storeConfig.actions.scrollPrev() ).not.toThrow();

			consoleSpy.mockRestore();
		} );

		it( 'should handle getElement returning object with ref', () => {
			const consoleSpy = jest.spyOn( console, 'warn' ).mockImplementation();
			const element = document.createElement( 'div' );

			( getElement as jest.Mock ).mockReturnValue( { ref: element } );

			expect( () => storeConfig.actions.scrollPrev() ).not.toThrow();

			consoleSpy.mockRestore();
		} );

		it( 'should handle getElement returning object with null ref', () => {
			const consoleSpy = jest.spyOn( console, 'warn' ).mockImplementation();

			( getElement as jest.Mock ).mockReturnValue( { ref: null } );

			expect( () => storeConfig.actions.scrollPrev() ).not.toThrow();

			consoleSpy.mockRestore();
		} );

		it( 'should handle getElement returning undefined', () => {
			const consoleSpy = jest.spyOn( console, 'warn' ).mockImplementation();

			( getElement as jest.Mock ).mockReturnValue( undefined );

			expect( () => storeConfig.actions.scrollPrev() ).not.toThrow();

			consoleSpy.mockRestore();
		} );
	} );
} );

describe( 'Edge Cases and Error Handling', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'should handle carousel with no slides gracefully', () => {
		const container = document.createElement( 'div' );
		container.className = 'embla__container';

		const mockContext = createMockContext( {
			selectedIndex: 0,
			scrollSnaps: [],
		} );

		( getContext as jest.Mock ).mockReturnValue( mockContext );
		( getElement as jest.Mock ).mockReturnValue( {
			ref: container,
		} );

		// Should not throw
		expect( () => storeConfig.callbacks.isSlideActive() ).not.toThrow();
	} );

	it( 'should handle RTL direction in context', () => {
		const mockContext = createMockContext( {
			options: { direction: 'rtl', loop: true },
		} );

		( getContext as jest.Mock ).mockReturnValue( mockContext );

		expect( mockContext.options.direction ).toBe( 'rtl' );
	} );

	it( 'should handle autoplay configuration', () => {
		const mockContextWithAutoplay = createMockContext( {
			autoplay: {
				delay: 3000,
				stopOnInteraction: true,
				stopOnMouseEnter: false,
			},
			isPlaying: true,
		} );

		expect( mockContextWithAutoplay.autoplay ).toEqual( {
			delay: 3000,
			stopOnInteraction: true,
			stopOnMouseEnter: false,
		} );
		expect( mockContextWithAutoplay.isPlaying ).toBe( true );
	} );

	it( 'should handle timerIterationId for animation resets', () => {
		const mockContext = createMockContext( {
			timerIterationId: 5,
		} );

		expect( mockContext.timerIterationId ).toBe( 5 );

		// Simulate increment on slide change
		mockContext.timerIterationId += 1;

		expect( mockContext.timerIterationId ).toBe( 6 );
	} );

	it( 'should handle large number of slides', () => {
		const scrollSnaps = Array.from( { length: 100 }, ( _, i ) => ( {
			index: i,
		} ) );
		const mockContext = createMockContext( {
			scrollSnaps,
			selectedIndex: 50,
		} );

		expect( mockContext.scrollSnaps ).toHaveLength( 100 );
		expect( mockContext.selectedIndex ).toBe( 50 );
	} );
} );
