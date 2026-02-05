<?php
/**
 * PHPStan bootstrap - define constants for static analysis.
 *
 * This file is loaded by PHPStan to provide type information
 * for WordPress and plugin constants.
 *
 * @package Core_Carousel
 */

// WordPress core constants.
define( 'ABSPATH', '/var/www/html/' );
define( 'DAY_IN_SECONDS', 86400 );
define( 'WP_DEBUG', false );

// Plugin constants.
define( 'CORE_CAROUSEL_PATH', '/var/www/html/wp-content/plugins/core-carousel' );
define( 'CORE_CAROUSEL_URL', 'https://example.com/wp-content/plugins/core-carousel' );
define( 'CORE_CAROUSEL_BUILD_PATH', CORE_CAROUSEL_PATH . '/build' );
define( 'CORE_CAROUSEL_BUILD_URL', CORE_CAROUSEL_URL . '/build' );
