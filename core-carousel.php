<?php
/**
 * Plugin Name: Core Carousel
 * Description: Carousel block using Embla and WordPress Interactivity API.
 * Plugin URI:  https://rtcamp.com
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * Contributors: danish17, immasud
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0.0
 * Text Domain: core-carousel
 *
 * @package core-carousel
 */

define( 'CORE_CAROUSEL_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CORE_CAROUSEL_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'CORE_CAROUSEL_BUILD_PATH', CORE_CAROUSEL_PATH . '/build' );
define( 'CORE_CAROUSEL_BUILD_URL', CORE_CAROUSEL_URL . '/build' );

require_once CORE_CAROUSEL_PATH . '/vendor/autoload.php';

/**
 * Plugin loader.
 */
function core_carousel_loader() {
	\Core_Carousel\Plugin::get_instance();
}

core_carousel_loader();
