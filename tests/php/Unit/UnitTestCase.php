<?php
/**
 * Base test case for Core Carousel unit tests.
 *
 * @package Core_Carousel\Tests\Unit
 */

declare(strict_types=1);

namespace Core_Carousel\Tests\Unit;

use Brain\Monkey;
use PHPUnit\Framework\TestCase;

/**
 * Base test case class that sets up Brain\Monkey.
 */
abstract class UnitTestCase extends TestCase {
	/**
	 * Set up test environment.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();
	}

	/**
	 * Tear down test environment.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}
}
