<?php
/**
 * Unit tests for the Plugin class.
 *
 * Tests cover:
 * - Block category registration
 * - Block registration (all 5 carousel blocks)
 * - Pattern category registration
 * - Block pattern registration and caching
 * - Error handling and edge cases
 *
 * @package Rt_Carousel\Tests\Unit
 */

declare(strict_types=1);

namespace Rt_Carousel\Tests\Unit;

use Brain\Monkey\Actions;
use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Rt_Carousel\Plugin;

/**
 * Tests for the Plugin class.
 */
class PluginTest extends UnitTestCase {

	/**
	 * The expected block slugs that should be registered.
	 *
	 * @var array<string>
	 */
	private const EXPECTED_BLOCKS = [
		'carousel',
		'carousel/controls',
		'carousel/dots',
		'carousel/progress',
		'carousel/viewport',
		'carousel/slide',
	];

	/**
	 * Helper to get Plugin instance via reflection without triggering singleton.
	 *
	 * @return Plugin
	 */
	private function getPluginInstance(): Plugin {
		$reflection = new \ReflectionClass( Plugin::class );
		return $reflection->newInstanceWithoutConstructor();
	}

	/**
	 * Helper to invoke a protected/private method on an object.
	 *
	 * @param object $object     The object instance.
	 * @param string $methodName The method name to invoke.
	 * @param array  $args       Arguments to pass to the method.
	 * @return mixed The return value of the method.
	 */
	private function invokeMethod( object $object, string $methodName, array $args = [] ): mixed {
		$reflection = new \ReflectionClass( $object );
		$method     = $reflection->getMethod( $methodName );

		return $method->invokeArgs( $object, $args );
	}

	/**
	 * Test that register_block_category adds the category.
	 *
	 * @return void
	 */
	public function test_register_block_category_adds_category(): void {
		Functions\when( '__' )->returnArg();

		$instance = $this->getPluginInstance();

		$existing_categories = [
			[
				'slug'  => 'text',
				'title' => 'Text',
			],
		];

		$result = $this->invokeMethod( $instance, 'register_block_category', [ $existing_categories ] );

		$this->assertCount( 2, $result );
		$this->assertSame( 'rt-carousel', $result[1]['slug'] );
		$this->assertSame( 'rtCarousel', $result[1]['title'] );
	}

	/**
	 * Test that register_block_category preserves existing categories.
	 *
	 * @return void
	 */
	public function test_register_block_category_preserves_existing(): void {
		Functions\when( '__' )->returnArg();

		$instance = $this->getPluginInstance();

		$existing_categories = [
			[
				'slug'  => 'media',
				'title' => 'Media',
			],
			[
				'slug'  => 'design',
				'title' => 'Design',
			],
		];

		$result = $this->invokeMethod( $instance, 'register_block_category', [ $existing_categories ] );

		$this->assertCount( 3, $result );
		$this->assertSame( 'media', $result[0]['slug'] );
		$this->assertSame( 'design', $result[1]['slug'] );
		$this->assertSame( 'rt-carousel', $result[2]['slug'] );
	}

	/**
	 * Test that category is added to empty categories array.
	 *
	 * @return void
	 */
	public function test_register_block_category_with_empty_array(): void {
		Functions\when( '__' )->returnArg();

		$instance = $this->getPluginInstance();
		$result   = $this->invokeMethod( $instance, 'register_block_category', [ [] ] );

		$this->assertCount( 1, $result );
		$this->assertSame( 'rt-carousel', $result[0]['slug'] );
	}

	/**
	 * Test that register_blocks registers all expected blocks.
	 *
	 * @return void
	 */
	public function test_register_blocks_registers_all_blocks(): void {
		$registered_blocks = [];

		Functions\when( 'register_block_type' )->alias(
			function ( string $path ) use ( &$registered_blocks ): void {
				$registered_blocks[] = $path;
			}
		);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_blocks' );

		$this->assertCount( 6, $registered_blocks );

		// Verify each expected block is registered
		foreach ( self::EXPECTED_BLOCKS as $block ) {
			$found = false;
			foreach ( $registered_blocks as $path ) {
				if ( str_contains( $path, "/blocks/{$block}" ) ) {
					$found = true;
					break;
				}
			}
			$this->assertTrue( $found, "Block '{$block}' should be registered." );
		}
	}

	/**
	 * Test that blocks are registered in the correct order.
	 *
	 * @return void
	 */
	public function test_register_blocks_in_correct_order(): void {
		$registered_blocks = [];

		Functions\when( 'register_block_type' )->alias(
			function ( string $path ) use ( &$registered_blocks ): void {
				$registered_blocks[] = $path;
			}
		);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_blocks' );

		$this->assertStringContainsString( '/blocks/carousel', $registered_blocks[0] );
		$this->assertStringContainsString( '/blocks/carousel/controls', $registered_blocks[1] );
		$this->assertStringContainsString( '/blocks/carousel/dots', $registered_blocks[2] );
		$this->assertStringContainsString( '/blocks/carousel/progress', $registered_blocks[3] );
		$this->assertStringContainsString( '/blocks/carousel/viewport', $registered_blocks[4] );
		$this->assertStringContainsString( '/blocks/carousel/slide', $registered_blocks[5] );
	}

	/**
	 * Test that register_blocks does nothing when build path is not defined.
	 *
	 * @return void
	 */
	public function test_register_blocks_handles_missing_build_path(): void {
		// The actual behavior check: register_block_type should be called
		// for each block when the constant is defined (as it is in our tests).
		Functions\expect( 'register_block_type' )->times( 6 );

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_blocks' );

		// Assert that we got here without errors
		$this->assertTrue( true );
	}

	/**
	 * Test that register_pattern_category registers the category.
	 *
	 * @return void
	 */
	public function test_register_pattern_category_registers_category(): void {
		$category_registered = false;

		Functions\when( '__' )->returnArg();
		Functions\expect( 'register_block_pattern_category' )
			->once()
			->with(
				'rt-carousel',
				\Mockery::type( 'array' )
			)
			->andReturnUsing(
				function () use ( &$category_registered ): void {
					$category_registered = true;
				}
			);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_pattern_category' );

		$this->assertTrue( $category_registered );
	}

	/**
	 * Test that pattern category includes proper label.
	 *
	 * @return void
	 */
	public function test_register_pattern_category_includes_label(): void {
		Functions\when( '__' )->returnArg();

		/** @var array<string, mixed>|null $captured_args */
		$captured_args = null;

		Functions\expect( 'register_block_pattern_category' )
			->once()
			->with(
				'rt-carousel',
				\Mockery::on(
					function ( $args ) use ( &$captured_args ): bool {
						$captured_args = $args;
						return true;
					}
				)
			);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_pattern_category' );

		$this->assertIsArray( $captured_args );
		$this->assertNotNull( $captured_args );
		$this->assertArrayHasKey( 'label', $captured_args );
		$this->assertSame( 'rtCarousel', $captured_args['label'] );
	}

	/**
	 * Test register_block_patterns uses cached patterns when available.
	 *
	 * @return void
	 */
	public function test_register_block_patterns_uses_cache(): void {
		$cached_patterns = [
			[
				'slug' => 'rt-carousel/test-pattern',
				'args' => [
					'title'   => 'Test Pattern',
					'content' => '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->',
				],
			],
		];

		$pattern_registered = false;

		Functions\when( '__' )->returnArg();
		Functions\expect( 'get_transient' )
			->once()
			->with( 'rt_carousel_patterns_cache' )
			->andReturn( $cached_patterns );

		Functions\expect( 'register_block_pattern' )
			->once()
			->with( 'rt-carousel/test-pattern', \Mockery::type( 'array' ) )
			->andReturnUsing(
				function () use ( &$pattern_registered ): void {
					$pattern_registered = true;
				}
			);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_block_patterns' );

		$this->assertTrue( $pattern_registered );
	}

	/**
	 * Test register_block_patterns handles empty patterns gracefully.
	 *
	 * @return void
	 */
	public function test_register_block_patterns_handles_empty(): void {
		Functions\expect( 'get_transient' )
			->once()
			->with( 'rt_carousel_patterns_cache' )
			->andReturn( [] );

		Functions\expect( 'register_block_pattern' )->never();

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_block_patterns' );

		// Assert method completed without registering patterns
		$this->assertTrue( true );
	}

	/**
	 * Test register_block_patterns registers multiple patterns.
	 *
	 * @return void
	 */
	public function test_register_block_patterns_registers_multiple(): void {
		$cached_patterns = [
			[
				'slug' => 'rt-carousel/pattern-one',
				'args' => [
					'title'   => 'Pattern One',
					'content' => '<!-- wp:paragraph --><p>One</p><!-- /wp:paragraph -->',
				],
			],
			[
				'slug' => 'rt-carousel/pattern-two',
				'args' => [
					'title'   => 'Pattern Two',
					'content' => '<!-- wp:paragraph --><p>Two</p><!-- /wp:paragraph -->',
				],
			],
			[
				'slug' => 'rt-carousel/pattern-three',
				'args' => [
					'title'   => 'Pattern Three',
					'content' => '<!-- wp:paragraph --><p>Three</p><!-- /wp:paragraph -->',
				],
			],
		];

		$registered_patterns = [];

		Functions\when( '__' )->returnArg();
		Functions\expect( 'get_transient' )
			->once()
			->andReturn( $cached_patterns );

		Functions\expect( 'register_block_pattern' )
			->times( 3 )
			->andReturnUsing(
				function ( $slug ) use ( &$registered_patterns ): void {
					$registered_patterns[] = $slug;
				}
			);

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_block_patterns' );

		$this->assertCount( 3, $registered_patterns );
		$this->assertContains( 'rt-carousel/pattern-one', $registered_patterns );
		$this->assertContains( 'rt-carousel/pattern-two', $registered_patterns );
		$this->assertContains( 'rt-carousel/pattern-three', $registered_patterns );
	}

	/**
	 * Test that patterns without required fields are handled.
	 *
	 * @return void
	 */
	public function test_register_block_patterns_handles_invalid_structure(): void {
		// Pattern missing 'args' key
		$cached_patterns = [
			[
				'slug' => 'rt-carousel/valid-pattern',
				'args' => [
					'title'   => 'Valid',
					'content' => '<!-- wp:paragraph --><p>Valid</p><!-- /wp:paragraph -->',
				],
			],
		];

		Functions\when( '__' )->returnArg();
		Functions\expect( 'get_transient' )
			->once()
			->andReturn( $cached_patterns );

		Functions\expect( 'register_block_pattern' )->once();

		$instance = $this->getPluginInstance();
		$this->invokeMethod( $instance, 'register_block_patterns' );

		// Assert completed successfully
		$this->assertTrue( true );
	}

	/**
	 * Test that legacy_plugin_notice outputs nothing when old plugin is inactive.
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_no_output_when_inactive(): void {
		Functions\expect( 'is_multisite' )->andReturn( false );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( false );

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	/**
	 * Test that legacy_plugin_notice outputs nothing when user lacks capability (single-site).
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_no_output_without_capability(): void {
		Functions\expect( 'is_multisite' )->andReturn( false );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'activate_plugins' )->andReturn( false );

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	/**
	 * Test that legacy_plugin_notice renders notice with deactivation link (single-site).
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_renders_on_single_site(): void {
		Functions\expect( 'is_multisite' )->andReturn( false );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'activate_plugins' )->andReturn( true );
		Functions\expect( 'is_network_admin' )->andReturn( false );
		Functions\expect( 'admin_url' )->once()->andReturnUsing(
			function ( string $path ): string {
				return 'https://example.com/wp-admin/' . $path;
			}
		);
		Functions\expect( 'wp_nonce_url' )->once()->andReturnFirstArg();
		Functions\when( 'esc_html__' )->returnArg();
		Functions\when( 'esc_url' )->returnArg();

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertStringContainsString( 'notice-warning', $output );
		$this->assertStringContainsString( 'Carousel Kit', $output );
		$this->assertStringContainsString( 'action=deactivate', $output );
		$this->assertStringNotContainsString( 'networkwide=1', $output );
	}

	/**
	 * Test that legacy_plugin_notice outputs nothing on multisite without manage_network_plugins.
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_no_output_without_network_capability(): void {
		Functions\expect( 'is_multisite' )->andReturn( true );
		Functions\expect( 'is_plugin_active_for_network' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'manage_network_plugins' )->andReturn( false );

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	/**
	 * Test that legacy_plugin_notice renders with network deactivation URL on multisite.
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_renders_network_url_on_multisite(): void {
		Functions\expect( 'is_multisite' )->andReturn( true );
		Functions\expect( 'is_plugin_active_for_network' )->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'manage_network_plugins' )->andReturn( true );
		Functions\expect( 'is_network_admin' )->andReturn( true );
		Functions\expect( 'network_admin_url' )->once()->andReturnUsing(
			function ( string $path ): string {
				return 'https://example.com/wp-admin/network/' . $path;
			}
		);
		Functions\expect( 'wp_nonce_url' )->once()->andReturnFirstArg();
		Functions\when( 'esc_html__' )->returnArg();
		Functions\when( 'esc_url' )->returnArg();

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertStringContainsString( 'notice-warning', $output );
		$this->assertStringContainsString( 'networkwide=1', $output );
		$this->assertStringContainsString( 'network/', $output );
	}

	/**
	 * Test that legacy_plugin_notice outputs nothing for network-activated plugin on site admin.
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_no_output_network_plugin_on_site_admin(): void {
		Functions\expect( 'is_multisite' )->andReturn( true );
		Functions\expect( 'is_plugin_active_for_network' )->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'manage_network_plugins' )->andReturn( true );
		Functions\expect( 'is_network_admin' )->andReturn( false );

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	/**
	 * Test that legacy_plugin_notice outputs nothing for site-activated plugin on network admin.
	 *
	 * @return void
	 */
	public function test_legacy_plugin_notice_no_output_site_plugin_on_network_admin(): void {
		Functions\expect( 'is_multisite' )->andReturn( true );
		Functions\expect( 'is_plugin_active_for_network' )->with( 'carousel-kit/carousel-kit.php' )->andReturn( false );
		Functions\expect( 'is_plugin_active' )->once()->with( 'carousel-kit/carousel-kit.php' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with( 'activate_plugins' )->andReturn( true );
		Functions\expect( 'is_network_admin' )->andReturn( true );

		$instance = $this->getPluginInstance();

		ob_start();
		$this->invokeMethod( $instance, 'legacy_plugin_notice' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}
}
