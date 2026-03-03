# Color

Colors in allegro-ts are packed 32-bit integers in `0xAARRGGBB` format, matching Allegro 4's truecolor convention.

## Creating colors

```ts
function makecol(r: number, g: number, b: number): number;
function makeacol(r: number, g: number, b: number, a: number): number;
```

All components are in the `0–255` range. Values above 255 are clipped.

```ts
const red = makecol(255, 0, 0);
const green = makecol(0, 255, 0);
const blue = makecol(0, 0, 255);
const white = makecol(255, 255, 255);
const black = makecol(0, 0, 0);
const semi = makeacol(255, 0, 0, 128); // 50% transparent red
```

`makecol` is an alias for `makecol32` — all color depth variants (`makecol8`, `makecol15`, `makecol16`, `makecol24`, `makecol32`) produce the same result since allegro-ts always operates in 32-bit mode.

## Extracting components

```ts
function getr(color: number): number; // red   (0–255)
function getg(color: number): number; // green (0–255)
function getb(color: number): number; // blue  (0–255)
function geta(color: number): number; // alpha (0 = opaque, 255 = fully transparent)
```

::: info Alpha convention
Allegro 4 uses an **inverted alpha**: `0` means fully opaque and `255` means fully transparent. This is the opposite of CSS `rgba()`. The library handles the conversion internally when rendering.
:::

Depth-specific getters (`getr8`, `getr15`, `getr16`, `getr24`, `getr32`, etc.) are also available and behave identically.

## Palette

```ts
const PAL_SIZE = 256;

type PALETTE = RGB[];

interface RGB {
  r: number;
  g: number;
  b: number;
}
```

Palette functions (`set_palette`, `get_palette`, etc.) are present for API compatibility but have limited effect in 32-bit truecolor mode.

```ts
function set_palette(pal: PALETTE): void;
function get_palette(pal: PALETTE): void;
function set_color(index: number, p: RGB): void;
function get_color(index: number, p: RGB): void;
```
