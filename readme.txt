=== Carousel Kit ===
Contributors: rtcamp, danish17, immasud, gagan0123, up1512001
Tags: carousel, slider, block, interactivity-api, embla
Requires at least: 6.6
Tested up to: 6.9.1
Requires PHP: 8.2
Stable tag: 1.0.3
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A modular, high-performance carousel block for WordPress, powered by the Interactivity API and Embla Carousel.

== Description ==

**Carousel Kit** is a flexible, accessible carousel block for the WordPress block editor. Build dynamic carousels for posts, testimonials, images, and more—without writing code.

= Features =

* **Compound Block Architecture** – Mix and match any blocks inside the carousel
* **High Performance** – Powered by Embla Carousel v8
* **Interactivity API** – Reactive state management with zero hydration overhead
* **Query Loop Support** – Each post in a Query Loop becomes a slide automatically
* **Accessibility** – W3C-compliant roles, labels, and keyboard navigation
* **RTL Support** – Built-in support for Right-to-Left languages

= Block Components =

1. **Carousel** – The main wrapper and controller
2. **Carousel Viewport** – The visible scrolling area
3. **Carousel Slide** – Container for individual slides
4. **Carousel Controls** – Previous/Next navigation buttons
5. **Carousel Dots** – Pagination indicators

= Use Cases =

* Image galleries and sliders
* Testimonial carousels
* Post/product showcases
* Logo showcases
* Hero banners with multiple slides

= Source Code =

This plugin release includes transpiled production assets for performance. The complete, human-readable source code is publicly available at:

* https://github.com/rtCamp/carousel-kit

Build scripts, development files, and original TypeScript/JavaScript/PHP sources are maintained in that repository.

== Installation ==

1. Upload the `carousel-kit` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. In the block editor, search for "Carousel" and insert the block

== Frequently Asked Questions ==

= Does it work with Full Site Editing? =

Yes! Carousel Kit is fully compatible with FSE. Use it in templates, template parts, and anywhere blocks are supported.

= Can I nest other blocks inside slides? =

Absolutely. Each slide accepts any WordPress block—images, paragraphs, groups, columns, and third-party blocks.

= Does it support the Query Loop block? =

Yes. Add a Query Loop inside the Carousel Viewport, and each post becomes a slide automatically.

= Is it accessible? =

Yes. The carousel follows W3C accessibility guidelines with proper ARIA roles, labels, and full keyboard navigation.

= Can I have multiple carousels on the same page? =

Yes. Each carousel instance maintains its own independent state.

== Screenshots ==

1. Carousel block in the editor with multiple slides

== Changelog ==

= 1.0.3 =
* Fix: (Editor): Prevent ghost slides and state corruption when clicking between slides
* Fix: Swap misplaced editor images and remove hardcoded aspect ratio
* Fix: Outdated plugin version in plugin header

= 1.0.2 =
* Fix: Demo pattern now shows 4 slides per view
* Fix: Replace PNG images with optimized WEBP format
* New: Setup wizard styles
* New: Slide appender and setup wizard

= 1.0.1 =
* Fix: Resolve spacing issues in loop mode where gaps were missing between last and first slide
* Fix: Allow infinite loop in editor viewport to match frontend behavior

= 1.0.0 =
* Initial release
* Compound block architecture with Carousel, Viewport, Slide, Controls, and Dots
* Embla Carousel v8 integration
* WordPress Interactivity API support
* Query Loop integration
* RTL and accessibility support

[CHECK THE FULL CHANGELOG](https://github.com/rtCamp/carousel-kit/blob/main/CHANGELOG.md)