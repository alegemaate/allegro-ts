# Mouse

## Installation

```ts
function install_mouse(menu?: boolean): number;
function remove_mouse(): number;
```

Must be called **after** `set_gfx_mode()`. Attaches mouse event listeners to the canvas element.

| Parameter | Default | Description                                                                            |
| --------- | ------- | -------------------------------------------------------------------------------------- |
| `menu`    | `false` | If `true`, right-click context menu is allowed. If `false`, right-click is suppressed. |

Returns `0` on success, `-1` if already installed.

## Mouse position

```ts
let mouse_x: number; // x position relative to canvas
let mouse_y: number; // y position relative to canvas
let mouse_z: number; // cumulative scroll wheel delta
const mouse_w: number; // fourth axis (always -1)
```

Positions are relative to the top-left corner of the canvas.

## Mouse buttons

```ts
let mouse_b: number;
```

Bitmask of currently pressed buttons:

| Bit           | Button                            |
| ------------- | --------------------------------- |
| `mouse_b & 1` | Left mouse button                 |
| `mouse_b & 2` | Middle mouse button / wheel click |
| `mouse_b & 4` | Right mouse button                |

```ts
if (mouse_b & 1) console.log("Left button down");
if (mouse_b & 4) console.log("Right button down");
```

## Mouse movement deltas

```ts
let mouse_mx: number; // x movement since last frame
let mouse_my: number; // y movement since last frame
let mouse_mz: number; // wheel movement since last frame
```

These are reset each frame by the internal `_uberloop`.

## Cursor control

```ts
function show_mouse(bmp: BITMAP | null): number;
function scare_mouse(): number;
function show_os_cursor(cursor: number): void;
function select_mouse_cursor(cursor: number): void;
function set_mouse_cursor_bitmap(cursor: number, bmp: BITMAP | null): void;
```

`show_mouse(null)` hides the cursor; `show_mouse(screen)` shows it.

`scare_mouse()` hides the OS cursor, typically used when drawing a custom sprite cursor.

### Cursor type constants

| Constant                | Value | CSS cursor  |
| ----------------------- | ----- | ----------- |
| `MOUSE_CURSOR_NONE`     | `0`   | `auto`      |
| `MOUSE_CURSOR_ALLEGRO`  | `1`   | `auto`      |
| `MOUSE_CURSOR_ARROW`    | `2`   | `move`      |
| `MOUSE_CURSOR_BUSY`     | `3`   | `wait`      |
| `MOUSE_CURSOR_QUESTION` | `4`   | `help`      |
| `MOUSE_CURSOR_EDIT`     | `5`   | `crosshair` |

## Hardware cursor

```ts
function enable_hardware_cursor(): void;
function disable_hardware_cursor(): void;
```

When hardware cursor is enabled, `select_mouse_cursor` changes the OS cursor style instead of rendering a sprite.

## Positioning

```ts
function position_mouse(x: number, y: number): void;
function position_mouse_z(z: number): void;
```

Manually set the mouse position variables (simulated — does not move the actual OS cursor).

## Sprite cursor

```ts
function set_mouse_sprite(sprite: BITMAP | null): void;
function set_mouse_sprite_focus(x: number, y: number): void;
const mouse_sprite: BITMAP | null;
```

Set a custom bitmap to use as the software-rendered cursor. The focus point offsets the hotspot from the sprite's top-left corner.

## Other (stubs / no-ops)

```ts
function poll_mouse(): void;
function mouse_needs_poll(): boolean; // always false
function scare_mouse_area(x, y, w, h): void;
function set_mouse_range(x1, y1, x2, y2): void;
function set_mouse_speed(xspeed, yspeed): void;
function get_mouse_mickeys(mickeyx, mickeyy): void;
function mouse_callback(flags): void;
const freeze_mouse_flag: boolean; // always false
```
