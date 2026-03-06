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
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/var/www/html/' );
}

if ( ! defined( 'DAY_IN_SECONDS' ) ) {
	define( 'DAY_IN_SECONDS', 86400 );
}

if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

// Plugin constants.
if ( ! defined( 'CAROUSEL_KIT_PATH' ) ) {
	define( 'CAROUSEL_KIT_PATH', '/var/www/html/wp-content/plugins/carousel-kit' );
}

if ( ! defined( 'CAROUSEL_KIT_URL' ) ) {
	define( 'CAROUSEL_KIT_URL', 'https://example.com/wp-content/plugins/carousel-kit' );
}

if ( ! defined( 'CAROUSEL_KIT_BUILD_PATH' ) ) {
	define( 'CAROUSEL_KIT_BUILD_PATH', CAROUSEL_KIT_PATH . '/build' );
}

if ( ! defined( 'CAROUSEL_KIT_BUILD_URL' ) ) {
	define( 'CAROUSEL_KIT_BUILD_URL', CAROUSEL_KIT_URL . '/build' );
}
