# Core Carousel

**A modular, high-performance carousel block for WordPress, powered by the Interactivity API and Embla Carousel.**

Easily create dynamic, accessible, and customizable carousels for any content type—posts, testimonials, images, and more. Designed for speed, flexibility, and seamless integration with the WordPress block editor.

## Features

- **Flexible Compound Block Architecture**: Mix and match any blocks inside the carousel.
- **High Performance**: Viewport & Slide Engine powered by Embla Carousel.
- **Interactivity API**: Reactive state management with `data-wp-interactive`.
- **Dynamic Content**: Full support for WordPress **Query Loop** block.
- **Accessibility**: W3C-compliant roles, labels, and keyboard navigation.
- **RTL Support**: Built-in support for Right-to-Left languages.

## Documentation

- **[Installation](docs/INSTALLATION.md)**: How to install via ZIP or Composer.
- **[Usage Guide](docs/USAGE.md)**: Configuration, Attributes, and Patterns.
- **[Styling & Theming](docs/THEMING.md)**: CSS Variables and Customization.
- **[Developer API](docs/API.md)**: Context, State, and Interactivity API integration.
- **[Contributing](docs/CONTRIBUTING.md)**: Guidelines for contributing to the project.
- **[Command Reference](DEVELOPMENT.md)**: Build commands and tools.

## Block Structure

The plugin provides a suite of blocks that work together:

1.  **Carousel (Parent)**: The main wrapper and controller.
2.  **Carousel Viewport**: The visible area that handles scrolling.
3.  **Carousel Slide**: A wrapper for individual slides.
4.  **Carousel Controls**: Previous/Next buttons.
5.  **Carousel Dots**: Pagination indicators.

## Quick Example

```html
<!-- wp:core-carousel/carousel -->
    <!-- wp:core-carousel/carousel-viewport -->
        <!-- wp:core-carousel/carousel-slide -->
            <!-- wp:image /-->
        <!-- /wp:core-carousel/carousel-slide -->
        <!-- wp:core-carousel/carousel-slide -->
            <!-- wp:paragraph /-->
        <!-- /wp:core-carousel/carousel-slide -->
    <!-- /wp:core-carousel/carousel-viewport -->
    
    <!-- wp:core-carousel/carousel-controls /-->
    <!-- wp:core-carousel/carousel-dots /-->
<!-- /wp:core-carousel/carousel -->
```

## License
GPL-2.0-or-later