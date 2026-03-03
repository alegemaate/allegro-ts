# Graphics Mode

## `set_gfx_mode`

```ts
function set_gfx_mode(card: number, w: number, h: number, v_w?: number, v_h?: number): number;
```

Configures the canvas for rendering. Must be called before any drawing operations.

| Parameter | Description                             |
| --------- | --------------------------------------- |
| `card`    | Graphics mode constant (see below)      |
| `w`       | Canvas width in pixels                  |
| `h`       | Canvas height in pixels                 |
| `v_w`     | Virtual width (not supported, ignored)  |
| `v_h`     | Virtual height (not supported, ignored) |

Returns `0` on success, `-1` on error.

```ts
set_gfx_mode(GFX_AUTODETECT_WINDOWED, 640, 480, 0, 0);
```

**Side effects:**

- Sets `SCREEN_W` and `SCREEN_H`
- Resizes the canvas element
- Disables image smoothing
- Initialises the default `font`

## Graphics mode constants

| Constant                    | Value | Description                                        |
| --------------------------- | ----- | -------------------------------------------------- |
| `GFX_TEXT`                  | `-1`  | Text mode — sets canvas to 0×0                     |
| `GFX_AUTODETECT`            | `0`   | Default windowed mode                              |
| `GFX_AUTODETECT_FULLSCREEN` | `1`   | Attaches a click listener that requests fullscreen |
| `GFX_AUTODETECT_WINDOWED`   | `2`   | Standard windowed mode                             |
| `GFX_SAFE`                  | `3`   | Same as windowed                                   |

## Screen constants

```ts
let SCREEN_W: number; // canvas width, set by set_gfx_mode
let SCREEN_H: number; // canvas height, set by set_gfx_mode
```

## `screen`

```ts
const screen: BITMAP;
```

The global screen bitmap. All drawing calls target `screen` by default. It wraps the actual `<canvas>` element.

## Color depth

```ts
function set_color_depth(depth: number): number; // no-op, always 32-bit
function get_color_depth(): number; // always returns 32
```

## Refresh rate

```ts
function request_refresh_rate(rate: number): void; // no-op
function get_refresh_rate(): number; // always returns 60
```

## Display switching

```ts
function set_display_switch_mode(mode: number): number;
function get_display_switch_mode(): number;
function set_display_switch_callback(dir: number, cb: () => void): number;
function remove_display_switch_callback(cb: () => void): void;
function is_windowed_mode(): boolean;
```

### Switch mode constants

| Constant             | Value |
| -------------------- | ----- |
| `SWITCH_NONE`        | `0`   |
| `SWITCH_PAUSE`       | `1`   |
| `SWITCH_AMNESIA`     | `2`   |
| `SWITCH_BACKGROUND`  | `3`   |
| `SWITCH_BACKAMNESIA` | `4`   |
| `SWITCH_IN`          | `0`   |
| `SWITCH_OUT`         | `1`   |

`SWITCH_PAUSE` and `SWITCH_AMNESIA` pause the main loop when the pointer leaves the canvas.

## Video bitmaps

```ts
function show_video_bitmap(bmp: BITMAP | undefined): void;
function request_video_bitmap(bmp: BITMAP | undefined): BITMAP | undefined;
```

`show_video_bitmap` draws `bmp` to `screen` — it must have the same dimensions as the screen.

## Other

```ts
function vsync(): void; // no-op
function enable_triple_buffer(): number; // no-op, returns 0
function scroll_screen(x: number, y: number): void; // no-op
```
