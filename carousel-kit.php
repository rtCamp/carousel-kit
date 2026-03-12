<?php
/**
 * Plugin Name: Carousel Kit
 * Description: Carousel block using Embla and WordPress Interactivity API.
 * Plugin URI:  https://github.com/rtCamp/carousel-kit
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * Domain Path: /languages
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0.4
 * Text Domain: carousel-kit
 *
 * @package carousel-kit
 */

namespace Carousel_Kit;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define plugin constants.
 */
function constants(): void {
	define( 'CAROUSEL_KIT_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
	define( 'CAROUSEL_KIT_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
	define( 'CAROUSEL_KIT_BUILD_PATH', CAROUSEL_KIT_PATH . '/build' );
	define( 'CAROUSEL_KIT_BUILD_URL', CAROUSEL_KIT_URL . '/build' );
}

constants();

require_once __DIR__ . '/inc/Autoloader.php';
if ( ! Autoloader::autoload() ) {
	return;
}

/**
 * Plugin loader.
 */
function carousel_kit_loader(): void {
	Plugin::get_instance();
}

carousel_kit_loader();
