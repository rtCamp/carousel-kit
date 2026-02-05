<?php
/**
 * PHPUnit bootstrap file for Core Carousel plugin.
 *
 * @package Core_Carousel\Tests
 */

declare(strict_types=1);

namespace Core_Carousel\Tests;

// Load Composer autoloader.
require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';

// Define plugin constants for testing.
define( 'CORE_CAROUSEL_PATH', dirname( __DIR__, 2 ) );
define( 'CORE_CAROUSEL_URL', 'https://example.com/wp-content/plugins/core-carousel' );
define( 'CORE_CAROUSEL_BUILD_PATH', CORE_CAROUSEL_PATH . '/build' );
define( 'CORE_CAROUSEL_BUILD_URL', CORE_CAROUSEL_URL . '/build' );

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
