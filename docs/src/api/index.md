# API Reference

allegro-ts exports its entire API as named ES module exports. Every public symbol maps closely to the corresponding Allegro 4 function or constant.

## Modules

| Module                      | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| [Core](./core)              | Initialization, loading, game loop plumbing             |
| [Graphics Mode](./graphics) | `set_gfx_mode`, screen constants, display switching     |
| [Bitmap](./bitmap)          | Create, load, save, and query bitmaps                   |
| [Primitives](./primitives)  | Lines, rectangles, circles, polygons, flood fill        |
| [Sprites](./sprites)        | Draw, scale, rotate, flip, and pivot bitmaps            |
| [Font & Text](./font)       | Load fonts, measure and render text                     |
| [Color](./color)            | Pack/unpack RGBA values                                 |
| [Keyboard](./keyboard)      | Install keyboard, read key state                        |
| [Mouse](./mouse)            | Install mouse, read position and buttons                |
| [Timer](./timer)            | Install interrupt timers, `rest()`                      |
| [Samples](./sound)          | Load and play audio samples                             |
| [MIDI](./midi)              | Load and play MIDI files                                |
| [Math](./math)              | Random numbers, fixed-point helpers                     |
| [Types](./types)            | TypeScript interfaces: `BITMAP`, `FONT`, `SAMPLE`, etc. |

## Color format

allegro-ts uses the `0xAARRGGBB` packed integer color format throughout. Use `makecol(r, g, b)` to create colors and `getr/getg/getb/geta` to unpack them.

```ts
const red = makecol(255, 0, 0);
const white = makecol(255, 255, 255);
const semi = makeacol(0, 0, 255, 128); // semi-transparent blue
```

## Angles

Rotation angles follow the Allegro 4 fixed-point convention: **256 equals a full circle** (not 360° or 2π). Use `fix_to_rad` to convert internally.

```ts
rotate_sprite(screen, sprite, x, y, 64); // 90° (quarter turn)
rotate_sprite(screen, sprite, x, y, 128); // 180°
rotate_sprite(screen, sprite, x, y, 256); // 360° (full circle)
```

## Stub functions

Some functions exist purely for API compatibility and are no-ops in the browser:

- `lock_bitmap`, `acquire_bitmap`, `release_bitmap`
- `vsync`, `poll_scroll`, `request_scroll`
- `set_color_conversion`, `register_bitmap_file_type`

These will not error but have no effect.
