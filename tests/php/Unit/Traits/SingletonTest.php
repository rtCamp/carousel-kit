<?php
/**
 * Unit tests for the Singleton trait.
 *
 * @package Carousel_Kit\Tests\Unit\Traits
 */

declare(strict_types=1);

namespace Carousel_Kit\Tests\Unit\Traits;

use Brain\Monkey\Actions;
use Carousel_Kit\Tests\Unit\UnitTestCase;
use Carousel_Kit\Traits\Singleton;

/**
 * Test class A for singleton tests.
 */
class SingletonTestClassA {
	use Singleton;

	public bool $constructor_called = false;

	protected function __construct() {
		$this->constructor_called = true;
	}
}

/**
 * Test class B for singleton tests.
 */
class SingletonTestClassB {
	use Singleton;
}

/**
 * Test class C for singleton tests.
 */
class SingletonTestClassC {
	use Singleton;

	public bool $constructor_called = false;

	protected function __construct() {
		$this->constructor_called = true;
	}
}

/**
 * Tests for the Singleton trait.
 */
class SingletonTest extends UnitTestCase {
	/**
	 * Test that get_instance returns an instance of the class.
	 *
	 * @return void
	 */
	public function test_get_instance_returns_instance(): void {
		Actions\expectDone( 'carousel_kit_singleton_init_' . SingletonTestClassA::class )->once();

		$instance = SingletonTestClassA::get_instance();

		$this->assertInstanceOf( SingletonTestClassA::class, $instance );
	}

	/**
	 * Test that get_instance returns the same instance on subsequent calls.
	 *
	 * @return void
	 */
	public function test_get_instance_returns_same_instance(): void {
		Actions\expectDone( 'carousel_kit_singleton_init_' . SingletonTestClassB::class )->once();

		$instance1 = SingletonTestClassB::get_instance();
		$instance2 = SingletonTestClassB::get_instance();

		$this->assertSame( $instance1, $instance2 );
	}

	/**
	 * Test that constructor is called on first instantiation.
	 *
	 * @return void
	 */
	public function test_constructor_is_called(): void {
		Actions\expectDone( 'carousel_kit_singleton_init_' . SingletonTestClassC::class )->once();

		$instance = SingletonTestClassC::get_instance();

		$this->assertTrue( $instance->constructor_called );
	}
}
