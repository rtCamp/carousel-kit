<?php
/**
 * PHPStan bootstrap - define constants for static analysis.
 *
 * This file is loaded by PHPStan to provide type information
 * for WordPress and plugin constants.
 *
 * @package Carousel_Kit
 */

// WordPress core constants.
define( 'ABSPATH', '/var/www/html/' );
define( 'DAY_IN_SECONDS', 86400 );
define( 'WP_DEBUG', false );

// Plugin constants.
define( 'CAROUSEL_KIT_PATH', '/var/www/html/wp-content/plugins/carousel-kit' );
define( 'CAROUSEL_KIT_URL', 'https://example.com/wp-content/plugins/carousel-kit' );
define( 'CAROUSEL_KIT_BUILD_PATH', CAROUSEL_KIT_PATH . '/build' );
define( 'CAROUSEL_KIT_BUILD_URL', CAROUSEL_KIT_URL . '/build' );
