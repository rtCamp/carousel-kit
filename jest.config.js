/**
 * Jest configuration for Carousel Kit plugin.
 *
 * Extends @wordpress/scripts default configuration with:
 * - Custom test setup for WordPress and Embla mocks
 * - Module path aliases for cleaner imports
 * - Coverage thresholds to maintain code quality
 *
 * @see https://jestjs.io/docs/configuration
 */

const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,

	// Display name for clarity in multi-project setups
	displayName: 'carousel-kit',

	// Test setup files run after Jest environment is set up
	setupFilesAfterEnv: [
		...( defaultConfig.setupFilesAfterEnv || [] ),
		'<rootDir>/tests/js/setup.ts',
	],

	// Module resolution aliases
	moduleNameMapper: {
		...defaultConfig.moduleNameMapper,
		// Path alias for src directory
		'^@/(.*)$': '<rootDir>/src/$1',
		// Mock for WordPress Interactivity API (not available in test environment)
		'^@wordpress/interactivity$': '<rootDir>/tests/js/__mocks__/wordpress-interactivity.ts',
	},

	// Directories to ignore when searching for tests
	testPathIgnorePatterns: [
		'/node_modules/',
		'/build/',
		'/vendor/',
	],

	// Files to include in coverage reports
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		// Exclude type definition files
		'!src/**/*.d.ts',
		// Exclude barrel exports
		'!src/**/index.ts',
		// Exclude WordPress block JSON schemas
		'!src/**/*.json',
	],

	// Coverage thresholds - fail if coverage drops below these percentages
	coverageThreshold: {
		global: {
			branches: 40,
			functions: 40,
			lines: 40,
			statements: 40,
		},
	},

	// Coverage reporters for different outputs
	coverageReporters: [
		'text',
		'text-summary',
		'lcov',
		'html',
	],

	// Verbose output for CI environments
	verbose: process.env.CI === 'true',

	// Timeout for slow tests (useful for integration tests)
	testTimeout: 10000,
};
