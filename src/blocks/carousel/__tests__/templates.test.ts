/**
 * Unit tests for slide template definitions and the template registry.
 *
 * Verifies:
 * - All default templates have the required shape
 * - Template inner blocks produce valid BlockInstance arrays
 * - Query Loop template is flagged correctly
 * - The `rtcamp.carouselKit.slideTemplates` filter hook is applied
 *
 * @package
 */

import { getSlideTemplates } from '../templates';

/* ── Mocks ────────────────────────────────────────────────────────────────── */

// Provide a minimal createBlock mock that returns a plain object.
jest.mock( '@wordpress/blocks', () => ( {
	createBlock: jest.fn( ( name: string, attrs = {}, inner = [] ) => ( {
		name,
		attributes: attrs,
		innerBlocks: inner,
		clientId: `mock-${ name }-${ Math.random().toString( 36 ).slice( 2, 8 ) }`,
	} ) ),
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	applyFilters: jest.fn( ( _hookName: string, value: unknown ) => value ),
} ) );

jest.mock( '@wordpress/i18n', () => ( {
	__: jest.fn( ( str: string ) => str ),
} ) );

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe( 'Slide Templates', () => {
	describe( 'getSlideTemplates()', () => {
		it( 'returns an array of templates', () => {
			const templates = getSlideTemplates();
			expect( Array.isArray( templates ) ).toBe( true );
			expect( templates.length ).toBeGreaterThanOrEqual( 5 );
		} );

		it( 'applies the rtcamp.carouselKit.slideTemplates filter', () => {
			const { applyFilters } = require( '@wordpress/hooks' );
			getSlideTemplates();
			expect( applyFilters ).toHaveBeenCalledWith(
				'rtcamp.carouselKit.slideTemplates',
				expect.any( Array ),
			);
		} );
	} );

	describe( 'Template Shape', () => {
		const templates = getSlideTemplates();

		it.each( templates.map( ( t ) => [ t.name, t ] ) )(
			'template "%s" has required properties',
			( _name, template ) => {
				expect( typeof template.name ).toBe( 'string' );
				expect( template.name.length ).toBeGreaterThan( 0 );
				expect( typeof template.label ).toBe( 'string' );
				expect( typeof template.description ).toBe( 'string' );
				expect( typeof template.icon ).toBe( 'object' );
				expect( typeof template.innerBlocks ).toBe( 'function' );
			},
		);

		it( 'each template has a unique name', () => {
			const names = templates.map( ( t ) => t.name );
			expect( new Set( names ).size ).toBe( names.length );
		} );
	} );

	describe( 'Default Templates', () => {
		const templates = getSlideTemplates();
		const byName = ( name: string ) =>
			templates.find( ( t ) => t.name === name )!;

		it( 'blank template produces a paragraph block', () => {
			const blocks = byName( 'blank' ).innerBlocks();
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'core/paragraph' );
		} );

		it( 'image template produces an image block', () => {
			const blocks = byName( 'image' ).innerBlocks();
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'core/image' );
		} );

		it( 'hero template produces a cover with heading, paragraph, and button', () => {
			const blocks = byName( 'hero' ).innerBlocks();
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'core/cover' );
			const inner = blocks[ 0 ].innerBlocks;
			expect( inner ).toHaveLength( 3 );
			expect( inner[ 0 ].name ).toBe( 'core/heading' );
			expect( inner[ 1 ].name ).toBe( 'core/paragraph' );
			expect( inner[ 2 ].name ).toBe( 'core/buttons' );
		} );

		it( 'image-caption template produces an image and a paragraph', () => {
			const blocks = byName( 'image-caption' ).innerBlocks();
			expect( blocks ).toHaveLength( 2 );
			expect( blocks[ 0 ].name ).toBe( 'core/image' );
			expect( blocks[ 1 ].name ).toBe( 'core/paragraph' );
		} );

		it( 'query-loop template is flagged as isQueryLoop', () => {
			const ql = byName( 'query-loop' );
			expect( ql.isQueryLoop ).toBe( true );
		} );

		it( 'non-query-loop templates are not flagged as isQueryLoop', () => {
			templates
				.filter( ( t ) => t.name !== 'query-loop' )
				.forEach( ( t ) => {
					expect( t.isQueryLoop ).toBeFalsy();
				} );
		} );
	} );
} );
