<?php
/**
 * Plugin manifest class.
 *
 * @package Core_Carousel
 */

declare(strict_types=1);

namespace Core_Carousel\Inc;

use Core_Carousel\Inc\Traits\Singleton;

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
					'slug'  => 'core-carousel',
					'title' => __( 'Core Carousel', 'core-carousel' ),
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
			'carousel/viewport',
			'carousel/slide',
		];

		foreach ( $blocks as $block ) {
			// Ensure path constant is defined before use to avoid fatal errors.
			if ( ! defined( 'CORE_CAROUSEL_BUILD_PATH' ) ) {
				continue;
			}

			register_block_type( CORE_CAROUSEL_BUILD_PATH . '/blocks/' . $block );
		}
	}

	/**
	 * Register pattern category.
	 *
	 * @return void
	 */
	public function register_pattern_category(): void {
		register_block_pattern_category(
			'core-carousel',
			[
				'label'       => __( 'Core Carousel', 'core-carousel' ),
				'description' => __( 'Pre-configured carousel patterns for various use cases.', 'core-carousel' ),
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
		if ( ! defined( 'CORE_CAROUSEL_PATH' ) ) {
			return;
		}

		// Use cached patterns if available and not in debug mode.
		$cache_key = 'core_carousel_patterns_cache';
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
		$patterns_dir = CORE_CAROUSEL_PATH . '/examples';
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
			include $pattern_file;
			$content = ob_get_clean();

			if ( false === $content || '' === trim( $content ) ) {
				continue;
			}

			// Parse categories.
			$categories = ! empty( $file_headers['categories'] )
			? array_filter( array_map( 'trim', explode( ',', $file_headers['categories'] ) ) )
			: [ 'core-carousel' ];

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
