# Contributing to Carousel Kit

Thank you for your interest in contributing! We welcome all contributions, from bug reports to feature requests and code changes.

## Development Workflow

1.  **Fork** the repository.
2.  **Clone** your fork locally.
3.  **Install dependencies**:
    ```bash
    npm install
    composer install
    ```
4.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
5.  **Make your changes**.
6.  **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
    ```bash
    git commit -m "feat: add amazing new slide effect"
    ```
    *Note: We use `commitlint` to enforce this standard. Your commit will fail if the message is invalid.*
7.  **Push** to your fork.
8.  **Open a Pull Request**.

## Code Standards

- **PHP**: We follow WordPress Coding Standards (WPCS). Run `composer run lint` to check.
- **JavaScript/TypeScript**: We use the standard WordPress ESLint config. Run `npm run lint:js` to check.
- **CSS/SCSS**: We use Stylelint. Run `npm run lint:css` to check.

## Building the Plugin

To create a production-ready ZIP file:

```bash
make zip
```

This will create `carousel-kit.zip` in the project root, optimized for distribution (no dev dependencies).
