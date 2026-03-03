# Font & Text

## Loading fonts

```ts
function load_font(filename: string, size?: number): FONT;
```

Loads a web font from a URL by injecting a `@font-face` CSS rule. The default `size` is `12px`.

```ts
const myFont = await load_font("assets/pixel.ttf", 16);
```

## Default font

```ts
let font: FONT;
```

Set automatically by `set_gfx_mode`. Uses the browser's `Monospace` face at 12px.

## FONT structure

```ts
interface FONT {
  element: HTMLStyleElement | null;
  file: string;
  name: string;
  size: number;
  type: "fnt";
}
```

## Measuring text

```ts
function text_length(f: FONT, str: string): number; // width in pixels
function text_height(f: FONT): number; // returns f.size
```

## Rendering text

All text functions accept a `bg` parameter. Pass `-1` to skip drawing the background.

### textout_ex

```ts
function textout_ex(bitmap, f, s, x, y, colour, bg): void;
function textout_centre_ex(bitmap, f, s, x, y, colour, bg): void;
function textout_right_ex(bitmap, f, s, x, y, colour, bg): void;
function textout_justify_ex(bitmap, f, s, x, y, colour, bg): void;
```

Draw a string `s` at `(x, y)`.

### textprintf_ex

```ts
function textprintf_ex(bitmap, f, x, y, colour, bg, s, ...args): void;
function textprintf_centre_ex(bitmap, f, x, y, colour, bg, s, ...args): void;
function textprintf_right_ex(bitmap, f, x, y, colour, bg, s, ...args): void;
function textprintf_justify_ex(bitmap, f, x, y, colour, bg, s, ...args): void;
```

Formatted text using Allegro's `sprintf`-style format strings (`%i`, `%d`, `%s`, `%f`, etc.).

```ts
textprintf_ex(
  screen,
  font,
  10,
  10,
  makecol(255, 255, 255),
  -1,
  "Score: %i  Lives: %i",
  score,
  lives,
);
```

## Alignment

| Function suffix | Alignment                                   |
| --------------- | ------------------------------------------- |
| `_ex`           | Left-aligned at `(x, y)`                    |
| `_centre_ex`    | Centred — `x` is the midpoint               |
| `_right_ex`     | Right-aligned — `x` is the right edge       |
| `_justify_ex`   | Treated as centre in current implementation |

## Font utilities (stubs)

```ts
function destroy_font(f: FONT): void;
function make_trans_font(f: FONT): void;
function is_color_font(f: FONT): boolean; // always true
function is_mono_font(f: FONT): boolean; // always false
function is_compatible_font(f: FONT): boolean; // always true
function get_font_ranges(f: FONT): number; // always 1
function get_font_range_begin(f: FONT, range: number): number;
function get_font_range_end(f: FONT, range: number): number;
function extract_font_range(f: FONT, begin: number, end: number): FONT;
function transpose_font(f: FONT, drange: number): FONT;
function merge_fonts(f1: FONT, f2: FONT): FONT;
```

```ts
const allegro_404_char: string; // "^"
```
