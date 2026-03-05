# Carousel Kit

![Build Status](https://github.com/rtCamp/carousel-kit/actions/workflows/release.yml/badge.svg?branch=main)
![Latest Release](https://img.shields.io/github/v/release/rtCamp/carousel-kit)

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

## Requirements

| Requirement | Minimum      | Recommended |
| ----------- | ------------ | ----------- |
| WordPress   | 6.6+         | 6.9+        |
| PHP         | 8.2+         | 8.2+        |
| Gutenberg   | Not required | —           |

> **Note:** This plugin works with WordPress core—no Gutenberg plugin required.

## Browser Support

Carousel Kit supports all modern browsers:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 80+             |
| Firefox | 74+             |
| Safari  | 14+             |
| Edge    | 80+             |

> **Note:** Internet Explorer is not supported. The plugin requires ES2020+ features (optional chaining, nullish coalescing) and CSS custom properties.

## Block Structure

The plugin provides a suite of blocks that work together:

1.  **Carousel (Parent)**: The main wrapper and controller.
2.  **Carousel Viewport**: The visible area that handles scrolling.
3.  **Carousel Slide**: A wrapper for individual slides.
4.  **Carousel Controls**: Previous/Next buttons.
5.  **Carousel Dots**: Pagination indicators.

## FAQ

### Does it work with Full Site Editing (FSE)?

Yes! Carousel Kit is fully compatible with Full Site Editing. You can use the carousel block in templates, template parts, and anywhere blocks are supported.

### Can I nest other blocks inside slides?

Absolutely. Each slide is a container that accepts any WordPress block—images, paragraphs, groups, columns, and even other third-party blocks.

### Does it support the Query Loop block?

Yes. Simply add a Query Loop block inside the Carousel Viewport, and each post in the loop becomes a slide automatically. No special configuration needed.

### Is it accessible?

Yes. The carousel follows W3C accessibility guidelines with proper ARIA roles, labels, and full keyboard navigation support.

### Can I have multiple carousels on the same page?

Yes. Each carousel instance maintains its own independent state.

### What data is removed on uninstall?

On uninstall, Carousel Kit removes its cached pattern transient (`carousel_kit_patterns_cache`). It does not remove your posts or block content.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full release history.

## Live Demo

[**🚀 Try the Interactive Demo in WordPress Playground**](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/rtCamp/carousel-kit/main/blueprint.json)

## Feature Request

Have a feature request? [Open an issue](https://github.com/rtCamp/carousel-kit/issues) on GitHub.

## Contributors

- [Danish Shakeel](https://github.com/danish17)
- [Masud Rana](https://github.com/theMasudRana)
- [rtCamp](https://profiles.wordpress.org/rtcamp)
- [Aviral Mittal](https://github.com/aviral-mittal)
- [Vishal Kotak](https://github.com/vishal4669)
- [Aishwarrya Pande](https://github.com/AishwarryaPande)
- [Raj Patel](https://github.com/imrraaj)


## License
GPL-2.0-or-later
