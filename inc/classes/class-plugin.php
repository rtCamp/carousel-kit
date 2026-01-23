<?php
/**
 * Plugin manifest class.
 *
 * @package Carousel_System_Interactivity_API
 */

namespace Carousel_System_Interactivity_API\Inc;

use Carousel_System_Interactivity_API\Inc\Traits\Singleton;

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
					'slug'  => 'carousel-system',
					'title' => __( 'Carousel System', 'carousel-system-interactivity-api' ),
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
			register_block_type( CAROUSEL_SYSTEM_BUILD_PATH . '/blocks/' . $block );
		}
	}
}
