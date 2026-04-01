# Styling & Theming

Easily theme the carousel using CSS variables or block supports. Navigation blocks support color, spacing, and border controls in the editor.

## CSS Variables

### Core Layout
| Variable | Description |
| :--- | :--- |
| `--rt-carousel-gap` | Controlled by the `slideGap` attribute. Applied as margin to slides. |
| `--rt-carousel-slide-width` | Controls the width of each slide. Defaults to 100% or set by column variants. |

### Controls (Buttons)
| Variable                                  | Default                               | Description                 |
| ----------------------------------------- | ------------------------------------- | --------------------------- |
| `--rt-carousel-control-bg`              | `unset`                               | Background color of buttons |
| `--rt-carousel-control-color`           | `inherit`                             | Icon color                  |
| `--rt-carousel-control-size`            | `2.5rem`                              | Width/Height of buttons     |
| `--rt-carousel-control-padding`         | `0.5rem`                              | Padding inside buttons      |
| `--rt-carousel-control-border`          | `1.25px solid rgba(28, 28, 28, 0.3)`  | Border style                |
| `--rt-carousel-control-radius`          | `1rem`                                | Border radius               |
| `--rt-carousel-control-bg-hover`        | `rgba(248, 248, 248, 1)`              | Background on hover         |
| `--rt-carousel-control-border-hover`    | `1.25px solid rgba(28, 28, 28, 0.75)` | Border on hover             |
| `--rt-carousel-control-color-hover`     | `inherit`                             | Icon color on hover         |

### Dots (Pagination)
| Variable                              | Default               | Description            |
| ------------------------------------- | --------------------- | ---------------------- |
| `--rt-carousel-dots-gap`            | `0.5rem`              | Gap between dots       |
| `--rt-carousel-dot-size`            | `0.5rem`              | Size of inactive dots  |
| `--rt-carousel-dot-color`           | `rgb(221, 221, 221)`  | Color of inactive dots |
| `--rt-carousel-dot-radius`          | `50%`                 | Shape of the dots      |
| `--rt-carousel-dot-border`          | `none`                | Border style for dots  |
| `--rt-carousel-dot-active-scale`    | `0.75rem`             | Size of active dot     |
| `--rt-carousel-dot-active-color`    | `rgba(28, 28, 28, 1)` | Color of active dot    |

## Overriding Styles

You can override these variables globally in your theme's stylesheet or via `theme.json`.

### Global CSS (`style.css`)
```css
:root {
    --rt-carousel-control-bg: #000000;
    --rt-carousel-dot-active-color: #ff0000;
    --rt-carousel-gap: 20px;
}
```

### Theme.json
```json
{
    "styles": {
        "blocks": {
            "rt-carousel/carousel": {
                "css": "--rt-carousel-control-bg: #000000;"
            }
        }
    }
}
```
