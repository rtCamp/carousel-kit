<?php
/**
 * Plugin manifest class.
 *
 * @package Core_Carousel
 */

namespace Core_Carousel\Inc;

use Core_Carousel\Inc\Traits\Singleton;

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
	 */
	protected function setup_hooks() {
		add_action( 'init', [ $this, 'register_blocks' ] );
		add_filter( 'block_categories_all', [ $this, 'register_block_category' ] );
	}

	/**
	 * Register block category.
	 *
	 * @param array $categories Block categories.
	 *
	 * @return array
	 */
	public function register_block_category( $categories ) {
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
	 */
	public function register_blocks() {
		$blocks = [
			'carousel',
			'carousel/controls',
			'carousel/dots',
			'carousel/viewport',
			'carousel/slide',
		];

		foreach ( $blocks as $block ) {
			register_block_type( CORE_CAROUSEL_BUILD_PATH . '/blocks/' . $block );
		}
	}
}
