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

/// <reference types="jest" />

import { applyFilters } from '@wordpress/hooks';
import { getSlideTemplates, type SlideTemplate } from '../templates';

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

const mockedApplyFilters = jest.mocked( applyFilters );
let consoleWarnSpy: jest.SpiedFunction< typeof console.warn >;

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe( 'Slide Templates', () => {
	beforeEach( () => {
		consoleWarnSpy = jest.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		mockedApplyFilters.mockClear();
		mockedApplyFilters.mockImplementation( ( _hookName: string, value: unknown ) => value );
	} );

	afterEach( () => {
		consoleWarnSpy.mockRestore();
	} );

	describe( 'getSlideTemplates()', () => {
		it( 'returns an array of templates', () => {
			const templates = getSlideTemplates();
			expect( Array.isArray( templates ) ).toBe( true );
			expect( templates.length ).toBeGreaterThanOrEqual( 5 );
		} );

		it( 'applies the rtcamp.carouselKit.slideTemplates filter', () => {
			getSlideTemplates();
			expect( mockedApplyFilters ).toHaveBeenCalledWith(
				'rtcamp.carouselKit.slideTemplates',
				expect.any( Array ),
			);
		} );

		it( 'passes a fresh copy of the default templates to filters', () => {
			mockedApplyFilters.mockImplementationOnce( ( _hookName: string, value: unknown ) => {
				( value as SlideTemplate[] ).push( {
					name: 'testimonial',
					label: 'Testimonial',
					description: 'Quote with author name.',
					icon: 'format-quote',
					innerBlocks: () => [],
				} );
				return value;
			} );

			const mutatedTemplates = getSlideTemplates();
			const freshTemplates = getSlideTemplates();

			expect( mutatedTemplates.map( ( template ) => template.name ) ).toContain( 'testimonial' );
			expect( freshTemplates.map( ( template ) => template.name ) ).not.toContain( 'testimonial' );
		} );

		it( 'falls back to defaults when a filter returns a non-array value', () => {
			mockedApplyFilters.mockImplementationOnce( () => 'invalid' as never );

			const templates = getSlideTemplates();

			expect( Array.isArray( templates ) ).toBe( true );
			expect( templates.length ).toBeGreaterThanOrEqual( 5 );
			expect( templates.map( ( template ) => template.name ) ).toContain( 'blank' );
			expect( consoleWarnSpy ).toHaveBeenCalledWith(
				'rtcamp.carouselKit.slideTemplates filter returned a non-array value. Falling back to default slide templates.',
				'invalid',
			);
		} );
	} );

	describe( 'Template Shape', () => {
		const templates = getSlideTemplates();
		const templateCases: Array<[ string, SlideTemplate ]> = templates.map( ( template ) => [
			template.name,
			template,
		] );

		it.each<[ string, SlideTemplate ]>( templateCases )(
			'template "%s" has required properties',
			( _name, template ) => {
				expect( typeof template.name ).toBe( 'string' );
				expect( template.name.length ).toBeGreaterThan( 0 );
				expect( typeof template.label ).toBe( 'string' );
				expect( typeof template.description ).toBe( 'string' );
				expect( template.icon ).toBeDefined();
				expect( template.icon ).not.toBeNull();
				expect( [ 'string', 'function', 'object' ] ).toContain(
					typeof template.icon,
				);
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
			expect( blocks[ 0 ]!.name ).toBe( 'core/paragraph' );
		} );

		it( 'image template produces an image block', () => {
			const blocks = byName( 'image' ).innerBlocks();
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ]!.name ).toBe( 'core/image' );
		} );

		it( 'hero template produces a cover with heading, paragraph, and button', () => {
			const blocks = byName( 'hero' ).innerBlocks();
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ]!.name ).toBe( 'core/cover' );
			const inner = blocks[ 0 ]!.innerBlocks;
			expect( inner ).toHaveLength( 3 );
			expect( inner[ 0 ]!.name ).toBe( 'core/heading' );
			expect( inner[ 1 ]!.name ).toBe( 'core/paragraph' );
			expect( inner[ 2 ]!.name ).toBe( 'core/buttons' );
		} );

		it( 'image-caption template produces an image and a paragraph', () => {
			const blocks = byName( 'image-caption' ).innerBlocks();
			expect( blocks ).toHaveLength( 2 );
			expect( blocks[ 0 ]!.name ).toBe( 'core/image' );
			expect( blocks[ 1 ]!.name ).toBe( 'core/paragraph' );
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
