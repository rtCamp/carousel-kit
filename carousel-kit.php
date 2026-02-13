<?php
/**
 * Plugin Name: Carousel Kit
 * Description: Carousel block using Embla and WordPress Interactivity API.
 * Plugin URI:  https://github.com/rtCamp/carousel-kit
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * Contributors: iamdanih17, immasud
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0.0
 * Text Domain: carousel-kit
 *
 * @package carousel-kit
 */

define( 'CAROUSEL_KIT_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CAROUSEL_KIT_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'CAROUSEL_KIT_BUILD_PATH', CAROUSEL_KIT_PATH . '/build' );
define( 'CAROUSEL_KIT_BUILD_URL', CAROUSEL_KIT_URL . '/build' );

require_once CAROUSEL_KIT_PATH . '/vendor/autoload.php';

/**
 * Plugin loader.
 */
function carousel_kit_loader() {
	\Carousel_Kit\Plugin::get_instance();
}

carousel_kit_loader();
