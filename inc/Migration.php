<?php
/**
 * One-time migration from the old "carousel-kit" plugin.
 *
 * Only migrates wp_posts.post_content (Gutenberg block markup).
 * The old plugin did not store its slug in postmeta or options,
 * so those tables are intentionally excluded.
 *
 * The migration is not reversible.
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
 * Handles migration of post content from "carousel-kit" to "rt-carousel".
 */
class Migration {

	private const MIGRATED_OPTION = 'rt_carousel_migrated_from_carousel_kit';
	private const LOCK_OPTION     = 'rt_carousel_migration_lock';
	private const LOCK_TIMEOUT    = 300; // 5 minutes.
	private const BATCH_SIZE      = 500;

	/**
	 * Initializes the migration process if it hasn't already run.
	 *
	 * Uses an option as a flag to ensure the migration runs only once.
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
	 * Acquires an atomic lock, runs the migration, and only sets the
	 * permanent flag after success. If the process crashes mid-migration,
	 * the lock expires after LOCK_TIMEOUT seconds and the next request
	 * retries. Already-migrated posts won't match the LIKE clause, so
	 * retrying is safe.
	 *
	 * @internal Called via plugins_loaded hook only.
	 */
	private static function migrate(): void {
		if ( get_option( self::MIGRATED_OPTION ) ) {
			return;
		}

		// Atomic lock: add_option returns false if key already exists.
		$now = time();
		if ( ! add_option( self::LOCK_OPTION, $now, '', false ) ) {
			$locked_at = (int) get_option( self::LOCK_OPTION );
			if ( $now - $locked_at < self::LOCK_TIMEOUT ) {
				return; // Another process is still running.
			}
			// Lock is stale (process crashed) — reclaim it.
			update_option( self::LOCK_OPTION, $now, false );
		}

		$success = self::migrate_post_content();

		if ( $success ) {
			self::cleanup_legacy_data();
			update_option( self::MIGRATED_OPTION, '1', true );
		}

		delete_option( self::LOCK_OPTION );
	}

	/**
	 * Batch-replace all "carousel-kit" references in post content.
	 *
	 * Covers block delimiters, data-wp-interactive attributes, CSS classes,
	 * and block metadata. Revisions and trashed posts are included so they
	 * render correctly if restored.
	 *
	 * @return bool True on success, false if any query failed.
	 */
	private static function migrate_post_content(): bool {
		global $wpdb;

		while ( true ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-time migration.
			$ids = $wpdb->get_col(
				$wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts}
					 WHERE post_content LIKE BINARY %s OR post_content LIKE BINARY %s
					 LIMIT %d",
					'%carousel-kit%',
					'%Carousel Kit%',
					self::BATCH_SIZE
				)
			);

			if ( empty( $ids ) ) {
				break;
			}

			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
			$result = $wpdb->query(
				$wpdb->prepare(
					"UPDATE {$wpdb->posts}
					 SET post_content = REPLACE(
						 REPLACE( post_content, 'carousel-kit', 'rt-carousel' ),
						 'Carousel Kit',
						 'rtCarousel'
					 )
					 WHERE ID IN ({$placeholders})",
					...$ids
				)
			);
			// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare

			if ( false === $result ) {
				return false;
			}

			// LIKE matched but REPLACE changed nothing — likely a collation mismatch.
			// Break rather than return false to avoid infinite retries across requests.
			if ( 0 === $result ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- Important debug info for a migration failure that would otherwise cause infinite retries.
				error_log( 'rt_carousel migration: LIKE matched posts but REPLACE changed nothing — possible collation mismatch.' );
				break;
			}

			// Flush post caches so persistent object caches serve updated content.
			foreach ( $ids as $id ) {
				clean_post_cache( (int) $id );
			}
		}

		return true;
	}

	/**
	 * Cleans up legacy data from the old "carousel-kit" plugin.
	 *
	 * @return void
	 */
	private static function cleanup_legacy_data(): void {
		delete_transient( 'carousel_kit_patterns_cache' );
	}

	/**
	 * Removes the migration flag on uninstall. Does not revert post content.
	 */
	public static function uninstall(): void {
		delete_option( self::MIGRATED_OPTION );
		delete_option( self::LOCK_OPTION );
	}
}
