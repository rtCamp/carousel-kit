<?php
/**
 * This will be executed when the plugin is uninstalled.
 *
 * @package Carousel_Kit
 */

declare(strict_types=1);

namespace Carousel_Kit;

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Multisite loop for uninstalling from all sites.
 */
function multisite_uninstall(): void {
	if ( ! is_multisite() ) {
		uninstall();
		return;
	}

	$site_ids = get_sites(
		[
			'fields' => 'ids',
			'number' => 0,
		]
	) ?: [];

	foreach ( $site_ids as $site_id ) {
		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.switch_to_blog_switch_to_blog
		if ( ! switch_to_blog( (int) $site_id ) ) {
			continue;
		}

		uninstall();
		restore_current_blog();
	}
}

/**
 * The site-specific uninstall function.
 */
function uninstall(): void {
	delete_plugin_data();
}

/**
 * Deletes plugin transients and options.
 */
function delete_plugin_data(): void {
	delete_transient( 'carousel_kit_patterns_cache' );
}

multisite_uninstall();
