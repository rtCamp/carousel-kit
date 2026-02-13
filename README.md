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

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| WordPress   | 6.5+    | 6.6+        |
| PHP         | 7.4+    | 8.2+        |
| Gutenberg   | Not required | — |

> **Note:** The Interactivity API became stable in WordPress 6.5. This plugin works with WordPress core—no Gutenberg plugin required.

## Browser Support

Carousel Kit supports all modern browsers:

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 80+             |
| Firefox | 74+             |
| Safari  | 14+             |
| Edge    | 80+             |

> **Note:** Internet Explorer is not supported. The plugin requires ES2020+ features (optional chaining, nullish coalescing) and CSS custom properties.

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

## Screenshots

### Editor View
![Editor View](https://github.com/user-attachments/assets/3117b2d6-33be-49ea-8dee-c4ca3a637ec8)
*Adding and configuring carousel blocks in the WordPress editor.*

### Frontend View
![Frontend View](https://github.com/user-attachments/assets/32f719e5-5f20-4243-8967-4eef880519ae)
*The carousel in action on the frontend.*

### Settings Panel
![Settings Panel](https://github.com/user-attachments/assets/e0510e0b-44ba-4c56-ab15-d0ce9bd47322)

*Carousel configuration options in the block sidebar.*

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

## Changelog

### 1.0.0 (2026-02-03)

**Features:**
- Initial release with compound block architecture
- Embla Carousel integration with Interactivity API
- Query Loop support for dynamic content
- Autoplay with configurable delay and interaction controls
- Vertical and horizontal axis support
- Slides to scroll option
- Example patterns: Hero, Logo Showcase, Testimonials

**Bug Fixes:**
- Fixed gap issue for carousel items

See [CHANGELOG.md](CHANGELOG.md) for full release history.

## Roadmap

Planned features for upcoming releases:

- [ ] **Parallax transition effect** — Parallax animation effect
- [ ] **Thumbnail navigation** — Visual slide previews for navigation
- [ ] **Lazy loading** — Defer off-screen slide content loading
- [ ] **Loop/infinite scroll** — Seamless continuous scrolling
- [ ] **Progress bar indicator** — Visual autoplay progress
- [ ] **Breakpoint-specific settings** — Different slides per view at different screen sizes
- [ ] **Additional patterns** — More pre-built carousel patterns

Have a feature request? [Open an issue](https://github.com/rtCamp/carousel-kit/issues) on GitHub.

## Live Demo

[**🚀 Try the Interactive Demo in WordPress Playground**](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/rtCamp/carousel-kit/main/blueprint.json)

## Contributors

- [Danish Shakeel](https://github.com/danish17)
- [Masud Rana](https://github.com/theMasudRana)

## License
GPL-2.0-or-later
