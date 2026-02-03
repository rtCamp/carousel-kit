# Styling & Theming

Easily theme the carousel using CSS variables or block supports. Navigation blocks support color, spacing, and border controls in the editor.

## CSS Variables

### Core Layout
| Variable | Description |
| :--- | :--- |
| `--core-carousel-gap` | Controlled by the `slideGap` attribute. Applied as margin to slides. |
| `--core-carousel-slide-width` | Controls the width of each slide. Defaults to 100% or set by column variants. |

### Controls (Buttons)
| Variable                                  | Default                               | Description                 |
| ----------------------------------------- | ------------------------------------- | --------------------------- |
| `--core-carousel-control-bg`              | `unset`                               | Background color of buttons |
| `--core-carousel-control-color`           | `inherit`                             | Icon color                  |
| `--core-carousel-control-size`            | `2.5rem`                              | Width/Height of buttons     |
| `--core-carousel-control-padding`         | `0.5rem`                              | Padding inside buttons      |
| `--core-carousel-control-border`          | `1.25px solid rgba(28, 28, 28, 0.3)`  | Border style                |
| `--core-carousel-control-radius`          | `1rem`                                | Border radius               |
| `--core-carousel-control-bg-hover`        | `rgba(248, 248, 248, 1)`              | Background on hover         |
| `--core-carousel-control-border-hover`    | `1.25px solid rgba(28, 28, 28, 0.75)` | Border on hover             |
| `--core-carousel-control-color-hover`     | `inherit`                             | Icon color on hover         |

### Dots (Pagination)
| Variable                              | Default               | Description            |
| ------------------------------------- | --------------------- | ---------------------- |
| `--core-carousel-dots-gap`            | `0.5rem`              | Gap between dots       |
| `--core-carousel-dot-size`            | `0.5rem`              | Size of inactive dots  |
| `--core-carousel-dot-color`           | `rgb(221, 221, 221)`  | Color of inactive dots |
| `--core-carousel-dot-radius`          | `50%`                 | Shape of the dots      |
| `--core-carousel-dot-border`          | `none`                | Border style for dots  |
| `--core-carousel-dot-active-size`     | `0.75rem`             | Size of active dot     |
| `--core-carousel-dot-active-color`    | `rgba(28, 28, 28, 1)` | Color of active dot    |

## Overriding Styles

You can override these variables globally in your theme's stylesheet or via `theme.json`.

### Global CSS (`style.css`)
```css
:root {
    --core-carousel-control-bg: #000000;
    --core-carousel-dot-active-color: #ff0000;
    --core-carousel-gap: 20px;
}
```

### Theme.json
```json
{
    "styles": {
        "blocks": {
            "core-carousel/carousel": {
                "css": "--core-carousel-control-bg: #000000;"
            }
        }
    }
}
```
