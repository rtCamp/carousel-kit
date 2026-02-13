/**
 * Jest setup file for Carousel Kit tests.
 *
 * This file runs before each test file and sets up global mocks
 * for WordPress and Embla Carousel dependencies.
 */

import '@testing-library/jest-dom';

/**
 * Mock embla-carousel module.
 */
jest.mock( 'embla-carousel', () => ( {
	__esModule: true,
	default: jest.fn( () => ( {
		canScrollPrev: jest.fn( () => true ),
		canScrollNext: jest.fn( () => true ),
		scrollPrev: jest.fn(),
		scrollNext: jest.fn(),
		scrollTo: jest.fn(),
		selectedScrollSnap: jest.fn( () => 0 ),
		scrollSnapList: jest.fn( () => [ 0, 1, 2 ] ),
		slideNodes: jest.fn( () => [] ),
		on: jest.fn(),
		off: jest.fn(),
		destroy: jest.fn(),
		reInit: jest.fn(),
		rootNode: jest.fn(),
		containerNode: jest.fn(),
		plugins: jest.fn( () => ( {} ) ),
	} ) ),
} ) );

/**
 * Mock embla-carousel-autoplay module.
 */
jest.mock( 'embla-carousel-autoplay', () => ( {
	__esModule: true,
	default: jest.fn( () => ( {
		name: 'autoplay',
		options: { delay: 3000 },
		init: jest.fn(),
		destroy: jest.fn(),
		play: jest.fn(),
		stop: jest.fn(),
		reset: jest.fn(),
		isPlaying: jest.fn( () => false ),
	} ) ),
} ) );

/**
 * Mock WordPress block editor components.
 */
jest.mock( '@wordpress/block-editor', () => ( {
	useBlockProps: jest.fn( ( props = {} ) => ( {
		className: 'wp-block',
		...props,
	} ) ),
	useInnerBlocksProps: jest.fn( ( blockProps = {} ) => ( {
		...blockProps,
		children: null,
	} ) ),
	InspectorControls: jest.fn( ( { children } ) => children ),
	BlockControls: jest.fn( ( { children } ) => children ),
	InnerBlocks: {
		Content: jest.fn( () => null ),
	},
	store: {
		name: 'core/block-editor',
	},
} ) );

/**
 * Mock WordPress components.
 */
jest.mock( '@wordpress/components', () => ( {
	PanelBody: jest.fn( ( { children } ) => children ),
	ToggleControl: jest.fn( () => null ),
	RangeControl: jest.fn( () => null ),
	SelectControl: jest.fn( () => null ),
	Button: jest.fn( ( { children } ) => children ),
	Flex: jest.fn( ( { children } ) => children ),
	FlexItem: jest.fn( ( { children } ) => children ),
	FlexBlock: jest.fn( ( { children } ) => children ),
	__experimentalUnitControl: jest.fn( () => null ),
} ) );

/**
 * Mock WordPress data module.
 */
jest.mock( '@wordpress/data', () => ( {
	useSelect: jest.fn( () => ( {} ) ),
	useDispatch: jest.fn( () => ( {} ) ),
	select: jest.fn( () => ( {} ) ),
	dispatch: jest.fn( () => ( {} ) ),
	subscribe: jest.fn(),
	createReduxStore: jest.fn(),
	register: jest.fn(),
} ) );

/**
 * Mock WordPress i18n module.
 */
jest.mock( '@wordpress/i18n', () => ( {
	__: jest.fn( ( text: string ) => text ),
	_x: jest.fn( ( text: string ) => text ),
	_n: jest.fn( ( single: string ) => single ),
	sprintf: jest.fn( ( format: string, ...args: unknown[] ) => {
		let result = format;
		args.forEach( ( arg ) => {
			result = result.replace( '%s', String( arg ) );
			result = result.replace( '%d', String( arg ) );
		} );
		return result;
	} ),
} ) );

/**
 * Mock WordPress element module.
 */
jest.mock( '@wordpress/element', () => {
	const actualReact = jest.requireActual( 'react' );
	return {
		...actualReact,
		createInterpolateElement: jest.fn( ( text: string ) => text ),
		RawHTML: jest.fn( ( { children } ) => children ),
	};
} );

/**
 * Helper to reset all mocks between tests.
 */
beforeEach( () => {
	jest.clearAllMocks();
} );

/**
 * Helper factory to create mock Embla instance for use in tests.
 */
export const createMockEmblaInstance = () => ( {
	canScrollPrev: jest.fn( () => true ),
	canScrollNext: jest.fn( () => true ),
	scrollPrev: jest.fn(),
	scrollNext: jest.fn(),
	scrollTo: jest.fn(),
	selectedScrollSnap: jest.fn( () => 0 ),
	scrollSnapList: jest.fn( () => [ 0, 1, 2 ] ),
	slideNodes: jest.fn( () => [] ),
	on: jest.fn(),
	off: jest.fn(),
	destroy: jest.fn(),
	reInit: jest.fn(),
	rootNode: jest.fn( () => document.createElement( 'div' ) ),
	containerNode: jest.fn( () => document.createElement( 'div' ) ),
	plugins: jest.fn( () => ( {} ) ),
} );
