<?php
/**
 * Plugin manifest class.
 *
 * @package Rt_Carousel
 */

declare(strict_types=1);

namespace Rt_Carousel;

use Rt_Carousel\Traits\Singleton;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin class.
 */
class Plugin {
	use Singleton;

	/**
	 * Plugin constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup hooks.
	 *
	 * @return void
	 */
	protected function setup_hooks(): void {
		add_action( 'init', [ $this, 'register_blocks' ] );
		add_filter( 'block_categories_all', [ $this, 'register_block_category' ] );
		add_action( 'init', [ $this, 'register_pattern_category' ] );
		add_action( 'init', [ $this, 'register_block_patterns' ] );
		add_action( 'admin_notices', [ $this, 'legacy_plugin_notice' ] );
		add_action( 'network_admin_notices', [ $this, 'legacy_plugin_notice' ] );
	}

	/**
	 * Show an admin notice if the legacy "Carousel Kit" plugin is still active.
	 *
	 * Handles both single-site and network-wide activations.
	 */
	public function legacy_plugin_notice(): void {
		$old_plugin   = 'carousel-kit/carousel-kit.php';
		$network_wide = is_multisite() && is_plugin_active_for_network( $old_plugin );

		if ( ! is_plugin_active( $old_plugin ) ) {
			return;
		}

		if ( $network_wide && ! current_user_can( 'manage_network_plugins' ) ) {
			return;
		}

		if ( ! $network_wide && ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		if ( $network_wide ) {
			$deactivate_url = wp_nonce_url(
				network_admin_url( 'plugins.php?action=deactivate&plugin=' . urlencode( $old_plugin ) . '&networkwide=1' ),
				'deactivate-plugin_' . $old_plugin
			);
		} else {
			$deactivate_url = wp_nonce_url(
				admin_url( 'plugins.php?action=deactivate&plugin=' . urlencode( $old_plugin ) ),
				'deactivate-plugin_' . $old_plugin
			);
		}

		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s <a href="%s">%s</a></p></div>',
			esc_html__( 'The "Carousel Kit" plugin is still active. rtCarousel is its replacement — please deactivate Carousel Kit.', 'rt-carousel' ),
			esc_url( $deactivate_url ),
			esc_html__( 'Deactivate Carousel Kit', 'rt-carousel' )
		);
	}

	/**
	 * Register block category.
	 *
	 * @param array $categories Block categories.
	 *
	 * @return array
	 */
	public function register_block_category( array $categories ): array {
		return array_merge(
			$categories,
			[
				[
					'slug'  => 'rt-carousel',
					'title' => __( 'rtCarousel', 'rt-carousel' ),
				],
			]
		);
	}

	/**
	 * Register blocks.
	 *
	 * @return void
	 */
	public function register_blocks(): void {
		$blocks = [
			'carousel',
			'carousel/controls',
			'carousel/dots',
			'carousel/progress',
			'carousel/viewport',
			'carousel/slide',
		];

		foreach ( $blocks as $block ) {
			// Ensure path constant is defined before use to avoid fatal errors.
			if ( ! defined( 'RT_CAROUSEL_BUILD_PATH' ) ) {
				continue;
			}

			register_block_type( RT_CAROUSEL_BUILD_PATH . '/blocks/' . $block );
		}
	}

	/**
	 * Register pattern category.
	 *
	 * @return void
	 */
	public function register_pattern_category(): void {
		register_block_pattern_category(
			'rt-carousel',
			[
				'label'       => __( 'rtCarousel', 'rt-carousel' ),
				'description' => __( 'Pre-configured carousel patterns for various use cases.', 'rt-carousel' ),
			]
		);
	}

	/**
	 * Register block patterns.
	 *
	 * Uses a transient to cache file reads to improve performance on 'init'.
	 * Cache is bypassed if WP_DEBUG is true.
	 *
	 * @return void
	 */
	public function register_block_patterns(): void {
		if ( ! defined( 'RT_CAROUSEL_PATH' ) ) {
			return;
		}

		// Use cached patterns if available and not in debug mode.
		$cache_key = 'rt_carousel_patterns_cache';
		$patterns  = get_transient( $cache_key );

		if ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) || false === $patterns ) {
			$patterns = $this->load_patterns_from_disk();
			set_transient( $cache_key, $patterns, DAY_IN_SECONDS );
		}

		if ( empty( $patterns ) ) {
			return;
		}

		foreach ( $patterns as $pattern ) {
			register_block_pattern( $pattern['slug'], $pattern['args'] );
		}
	}

	/**
	 * Load patterns from the filesystem.
	 *
	 * Separated from registration logic for cleaner code and testability.
	 *
	 * @return array
	 */
	private function load_patterns_from_disk(): array {
		$patterns_dir = RT_CAROUSEL_PATH . '/examples/patterns';
		$data         = [];

		if ( ! is_dir( $patterns_dir ) ) {
			return $data;
		}

		$pattern_files = glob( $patterns_dir . '/*.php' );

		if ( empty( $pattern_files ) ) {
			return $data;
		}

		foreach ( $pattern_files as $pattern_file ) {
			$file_headers = get_file_data(
				$pattern_file,
				[
					'title'       => 'Title',
					'slug'        => 'Slug',
					'description' => 'Description',
					'categories'  => 'Categories',
				]
			);

			// Skip if required data is missing.
			if ( empty( $file_headers['title'] ) || empty( $file_headers['slug'] ) ) {
				continue;
			}

			// Skip if pattern is already registered.
			if ( \WP_Block_Patterns_Registry::get_instance()->is_registered( $file_headers['slug'] ) ) {
				continue;
			}

			ob_start();
			include $pattern_file; // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable -- $pattern_file is sourced from glob() in a fixed plugin directory (examples/patterns/*.php).
			$content = ob_get_clean();

			if ( false === $content || '' === trim( $content ) ) {
				continue;
			}

			// Parse categories.
			$categories = ! empty( $file_headers['categories'] )
			? array_filter( array_map( 'trim', explode( ',', $file_headers['categories'] ) ) )
			: [ 'rt-carousel' ];

			$data[] = [
				'slug' => $file_headers['slug'],
				'args' => [
					'title'       => $file_headers['title'],
					'description' => $file_headers['description'],
					'content'     => $content,
					'categories'  => $categories,
				],
			];
		}

		return $data;
	}
}
