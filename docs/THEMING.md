# Styling & Theming

Easily theme the carousel using CSS variables or block supports. Navigation blocks support color, spacing, and border controls in the editor.

## CSS Variables

### Core Layout
| Variable | Description |
| :--- | :--- |
| `--carousel-kit-gap` | Controlled by the `slideGap` attribute. Applied as margin to slides. |
| `--carousel-kit-slide-width` | Controls the width of each slide. Defaults to 100% or set by column variants. |

### Controls (Buttons)
| Variable                                  | Default                               | Description                 |
| ----------------------------------------- | ------------------------------------- | --------------------------- |
| `--carousel-kit-control-bg`              | `unset`                               | Background color of buttons |
| `--carousel-kit-control-color`           | `inherit`                             | Icon color                  |
| `--carousel-kit-control-size`            | `2.5rem`                              | Width/Height of buttons     |
| `--carousel-kit-control-padding`         | `0.5rem`                              | Padding inside buttons      |
| `--carousel-kit-control-border`          | `1.25px solid rgba(28, 28, 28, 0.3)`  | Border style                |
| `--carousel-kit-control-radius`          | `1rem`                                | Border radius               |
| `--carousel-kit-control-bg-hover`        | `rgba(248, 248, 248, 1)`              | Background on hover         |
| `--carousel-kit-control-border-hover`    | `1.25px solid rgba(28, 28, 28, 0.75)` | Border on hover             |
| `--carousel-kit-control-color-hover`     | `inherit`                             | Icon color on hover         |

### Dots (Pagination)
| Variable                              | Default               | Description            |
| ------------------------------------- | --------------------- | ---------------------- |
| `--carousel-kit-dots-gap`            | `0.5rem`              | Gap between dots       |
| `--carousel-kit-dot-size`            | `0.5rem`              | Size of inactive dots  |
| `--carousel-kit-dot-color`           | `rgb(221, 221, 221)`  | Color of inactive dots |
| `--carousel-kit-dot-radius`          | `50%`                 | Shape of the dots      |
| `--carousel-kit-dot-border`          | `none`                | Border style for dots  |
| `--carousel-kit-dot-active-size`     | `0.75rem`             | Size of active dot     |
| `--carousel-kit-dot-active-color`    | `rgba(28, 28, 28, 1)` | Color of active dot    |

## Overriding Styles

You can override these variables globally in your theme's stylesheet or via `theme.json`.

### Global CSS (`style.css`)
```css
:root {
    --carousel-kit-control-bg: #000000;
    --carousel-kit-dot-active-color: #ff0000;
    --carousel-kit-gap: 20px;
}
```

### Theme.json
```json
{
    "styles": {
        "blocks": {
            "carousel-kit/carousel": {
                "css": "--carousel-kit-control-bg: #000000;"
            }
        }
    }
}
```
