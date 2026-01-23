<?php
/**
 * Plugin Name: Carousel System - Interactivity API
 * Description: Standalone carousel block using Embla and WordPress Interactivity API.
 * Plugin URI:  https://rtcamp.com
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0.0
 * Text Domain: carousel-system-interactivity-api
 *
 * @package carousel-system-interactivity-api
 */

define( 'CAROUSEL_SYSTEM_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CAROUSEL_SYSTEM_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'CAROUSEL_SYSTEM_BUILD_PATH', CAROUSEL_SYSTEM_PATH . '/build' );
define( 'CAROUSEL_SYSTEM_BUILD_URL', CAROUSEL_SYSTEM_URL . '/build' );

require_once CAROUSEL_SYSTEM_PATH . '/inc/helpers/autoloader.php';
require_once CAROUSEL_SYSTEM_PATH . '/vendor/autoload.php';

/**
 * Plugin loader.
 */
function carousel_system_loader() {
	\Carousel_System_Interactivity_API\Inc\Plugin::get_instance();
}

carousel_system_loader();
