<?php
/**
 * Autoloader file for plugin.
 *
 * @package core-carousel
 */

namespace Core_Carousel\Inc\Helpers;

/**
 * Auto loader function.
 *
 * @param string $source Source namespace.
 *
 * @return void
 */
function autoloader( $source = '' ) {

	$resource_path  = false;
	$namespace_root = 'Core_Carousel\\';
	$source         = trim( $source, '\\' );

	if ( empty( $source ) || strpos( $source, '\\' ) === false || strpos( $source, $namespace_root ) !== 0 ) {
		// Not our namespace, bail out.
		return;
	}

	// Remove our root namespace.
	$source = str_replace( $namespace_root, '', $source );

	$path = explode(
		'\\',
		str_replace( '_', '-', strtolower( $source ) )
	);

	/**
	 * Time to determine which type of resource path it is,
	 * so that we can deduce the correct file path for it.
	 */
	if ( empty( $path[0] ) || empty( $path[1] ) ) {
		return;
	}

	$directory = '';
	$file_name = '';

	if ( 'inc' === $path[0] ) {
		switch ( $path[1] ) {
			case 'traits':
				$directory = 'traits';
				$file_name = sprintf( 'trait-%s', trim( strtolower( $path[2] ) ) );
				break;

			default:
				$directory = 'classes';
				$file_name = sprintf( 'class-%s', trim( strtolower( $path[1] ) ) );
				break;
		}

		$resource_path = sprintf( '%s/src/inc/%s/%s.php', untrailingslashit( CORE_CAROUSEL_PATH ), $directory, $file_name );
	}

	$resource_path_valid = validate_file( $resource_path );
	// For Windows platform, validate_file returns 2 so we've added this condition as well.
	if ( empty( $resource_path ) || ! file_exists( $resource_path ) || ( 0 !== $resource_path_valid && 2 !== $resource_path_valid ) ) {
		return;
	}

	// We are already making sure that the file exists and it's valid.
	require_once( $resource_path ); // phpcs:ignore
}

spl_autoload_register( '\Core_Carousel\Inc\Helpers\autoloader' );
