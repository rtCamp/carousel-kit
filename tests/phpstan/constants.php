<?php
/**
 * PHPStan bootstrap - define constants for static analysis.
 *
 * This file is loaded by PHPStan to provide type information
 * for WordPress and plugin constants.
 *
 * @package Rt_Carousel
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
if ( ! defined( 'RT_CAROUSEL_PATH' ) ) {
	define( 'RT_CAROUSEL_PATH', '/var/www/html/wp-content/plugins/rt-carousel' );
}

if ( ! defined( 'RT_CAROUSEL_URL' ) ) {
	define( 'RT_CAROUSEL_URL', 'https://example.com/wp-content/plugins/rt-carousel' );
}

if ( ! defined( 'RT_CAROUSEL_BUILD_PATH' ) ) {
	define( 'RT_CAROUSEL_BUILD_PATH', RT_CAROUSEL_PATH . '/build' );
}

if ( ! defined( 'RT_CAROUSEL_BUILD_URL' ) ) {
	define( 'RT_CAROUSEL_BUILD_URL', RT_CAROUSEL_URL . '/build' );
}
