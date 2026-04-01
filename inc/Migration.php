<?php
/**
 * Handles one-time data migrations from the old "carousel-kit" plugin.
 *
 * Scope: Only migrates `wp_posts.post_content` (Gutenberg block markup).
 * The old plugin did not store its slug in postmeta or options, so those
 * tables are intentionally excluded.
 *
 * The migration is not reversible. Uninstalling the plugin removes the
 * migration flag but does not revert post content.
 *
 * @package Rt_Carousel
 */

declare(strict_types=1);

namespace Rt_Carousel;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Migration class.
 *
 * Runs automatically on `plugins_loaded` and migrates stored post content
 * from the old "carousel-kit" namespace to "rt-carousel". Guarded by a
 * wp_options flag so the DB queries execute at most once per site.
 */
class Migration {

	/**
	 * Option key used to track whether migration has already run.
	 */
	private const MIGRATED_OPTION = 'rt_carousel_migrated_from_carousel_kit';

	/**
	 * Register the migration hook if migration hasn't run yet.
	 *
	 * The option is autoloaded, so this check is a cache hit with
	 * zero DB overhead on every subsequent request.
	 */
	public static function init(): void {
		if ( get_option( self::MIGRATED_OPTION ) ) {
			return;
		}

		add_action(
			'plugins_loaded',
			static function (): void {
				self::migrate();
			}
		);
	}

	/**
	 * Run the migration if it hasn't been run yet.
	 *
	 * Uses `add_option` as an atomic guard: if the key already exists the
	 * call returns `false` and no work is done, preventing race conditions
	 * when concurrent requests hit `plugins_loaded` simultaneously.
	 *
	 * @internal Called via `plugins_loaded` hook only.
	 */
	private static function migrate(): void {
		// Atomic check-and-set: add_option returns false if key already exists.
		if ( ! add_option( self::MIGRATED_OPTION, '1', '', true ) ) {
			return;
		}

		$success = self::migrate_post_content();

		if ( ! $success ) {
			// Migration failed — remove the flag so it can retry on next load.
			delete_option( self::MIGRATED_OPTION );
			return;
		}

		self::cleanup_legacy_data();
	}

	/**
	 * Replace all "carousel-kit" references in post content.
	 *
	 * A broad REPLACE covers block comment delimiters, data-wp-interactive
	 * attributes, CSS classes, inline styles, and block metadata in one pass.
	 *
	 * Revisions and trashed posts are intentionally included — if restored,
	 * they must contain the updated namespace to render correctly.
	 *
	 * @return bool True on success, false if any query failed.
	 */
	private static function migrate_post_content(): bool {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-time migration; no persistent query.
		$result = $wpdb->query(
			"UPDATE {$wpdb->posts}
			 SET post_content = REPLACE( post_content, 'carousel-kit', 'rt-carousel' )
			 WHERE post_content LIKE '%carousel-kit%'"
		);

		if ( false === $result ) {
			return false;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$result = $wpdb->query(
			"UPDATE {$wpdb->posts}
			 SET post_content = REPLACE( post_content, 'Carousel Kit', 'rtCarousel' )
			 WHERE post_content LIKE '%Carousel Kit%'"
		);

		return false !== $result;
	}

	/**
	 * Remove orphaned data left behind by the old plugin.
	 */
	private static function cleanup_legacy_data(): void {
		delete_transient( 'carousel_kit_patterns_cache' );
	}

	/**
	 * Remove migration artifacts on uninstall.
	 *
	 * Note: This removes the flag only. The post content migration
	 * is not reversible by design.
	 */
	public static function uninstall(): void {
		delete_option( self::MIGRATED_OPTION );
	}
}
