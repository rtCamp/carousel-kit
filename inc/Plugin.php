<?php
/**
 * Plugin manifest class.
 *
 * @package Carousel_Kit
 */

declare(strict_types=1);

namespace Carousel_Kit;

use WP_Block;
use WP_HTML_Tag_Processor;
use Carousel_Kit\Traits\Singleton;

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
		add_filter( 'render_block_carousel-kit/carousel-slide', [ $this, 'handle_lazy_load_images' ], 10, 3 );
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
					'slug'  => 'carousel-kit',
					'title' => __( 'Carousel Kit', 'carousel-kit' ),
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
			if ( ! defined( 'CAROUSEL_KIT_BUILD_PATH' ) ) {
				continue;
			}

			register_block_type( CAROUSEL_KIT_BUILD_PATH . '/blocks/' . $block );
		}
	}

	/**
	 * Register pattern category.
	 *
	 * @return void
	 */
	public function register_pattern_category(): void {
		register_block_pattern_category(
			'carousel-kit',
			[
				'label'       => __( 'Carousel Kit', 'carousel-kit' ),
				'description' => __( 'Pre-configured carousel patterns for various use cases.', 'carousel-kit' ),
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
		if ( ! defined( 'CAROUSEL_KIT_PATH' ) ) {
			return;
		}

		// Use cached patterns if available and not in debug mode.
		$cache_key = 'carousel_kit_patterns_cache';
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
		$patterns_dir = CAROUSEL_KIT_PATH . '/examples/patterns';
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
			: [ 'carousel-kit' ];

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

	/**
	 * Add loading="lazy" to images in carousel slides.
	 *
	 * @param string   $block_content The block content.
	 * @param array    $parsed_block  The parsed block.
	 * @param WP_Block $instance      The block instance.
	 *
	 * @return string Modified block content.
	 */
	public function handle_lazy_load_images( string $block_content, array $parsed_block, WP_Block $instance ): string {
		// Bail early if the parent block to check lazyLoadImages setting is not set.
		if ( ! isset( $instance->context["carousel-kit/carousel/lazyLoadImages"] ) ) {
			return $block_content;
		}

		$lazy_load = $instance->context["carousel-kit/carousel/lazyLoadImages"];

		// If lazy loading is disabled, return as-is.
		if ( ! $lazy_load ) {
			return $block_content;
		}

		// Check if this slide has disableLazyLoadImages set.
		$slide_attrs = $parsed_block['attrs'] ?? array();
		$disable_lazy = isset( $slide_attrs['disableLazyLoadImages'] ) ? $slide_attrs['disableLazyLoadImages'] : false;

		if ( $disable_lazy ) {
			return $block_content;
		}

		// Use WP_HTML_Tag_Processor to add loading="lazy" to <img> tags.
		$processor = new WP_HTML_Tag_Processor( $block_content );

		while ( $processor->next_tag( 'img' ) ) {
			// Only add if loading attribute is not already set.
			if ( null === $processor->get_attribute( 'loading' ) ) {
				$processor->set_attribute( 'loading', 'lazy' );
			}
		}

		return $processor->get_updated_html();
	}
}
