# Core Carousel

![Build Status](https://github.com/rtCamp/core-carousel/actions/workflows/release.yml/badge.svg?branch=main)
![Latest Release](https://img.shields.io/github/v/release/rtCamp/core-carousel)

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

## Live Demo

[**🚀 Try the Interactive Demo in WordPress Playground**](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/rtCamp/core-carousel/production/blueprint.json)

## Contributors

- [Danish Shakeel](https://github.com/danish17)
- [Masud Rana](https://github.com/mr-masudrana00)

## License
GPL-2.0-or-later