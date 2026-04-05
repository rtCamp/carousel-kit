<?php
/**
 * Plugin Name: rtCarousel
 * Description: Carousel block using Embla and WordPress Interactivity API.
 * Plugin URI:  https://github.com/rtCamp/rt-carousel
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * Domain Path: /languages
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0.4
 * Text Domain: rt-carousel
 *
 * @package rt-carousel
 */

namespace Rt_Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define plugin constants.
 */
function constants(): void {
	define( 'RT_CAROUSEL_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
	define( 'RT_CAROUSEL_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
	define( 'RT_CAROUSEL_BUILD_PATH', RT_CAROUSEL_PATH . '/build' );
	define( 'RT_CAROUSEL_BUILD_URL', RT_CAROUSEL_URL . '/build' );
}

constants();

require_once __DIR__ . '/inc/Autoloader.php';
if ( ! Autoloader::autoload() ) {
	return;
}

/**
 * Initialize the migration class to handle any necessary data migrations from the old "carousel-kit" plugin.
 */
Migration::init();

/**
 * Plugin loader.
 */
function rt_carousel_loader(): void {
	Plugin::get_instance();
}

rt_carousel_loader();
