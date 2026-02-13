<?php
/**
 * PHPUnit bootstrap file for Carousel Kit plugin.
 *
 * @package Carousel_Kit\Tests
 */

declare(strict_types=1);

namespace Carousel_Kit\Tests;

// Load Composer autoloader.
require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';

// Define plugin constants for testing.
define( 'CAROUSEL_KIT_PATH', dirname( __DIR__, 2 ) );
define( 'CAROUSEL_KIT_URL', 'https://example.com/wp-content/plugins/carousel-kit' );
define( 'CAROUSEL_KIT_BUILD_PATH', CAROUSEL_KIT_PATH . '/build' );
define( 'CAROUSEL_KIT_BUILD_URL', CAROUSEL_KIT_URL . '/build' );

// Define WordPress constants needed for testing.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/var/www/html/' );
}

if ( ! defined( 'DAY_IN_SECONDS' ) ) {
	define( 'DAY_IN_SECONDS', 86400 );
}

if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

// Initialize Brain\Monkey for WordPress function mocking.
\Brain\Monkey\setUp();

/**
 * Teardown Brain\Monkey after all tests.
 */
register_shutdown_function(
	function (): void {
		\Brain\Monkey\tearDown();
	}
);
