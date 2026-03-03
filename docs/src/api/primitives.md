# Primitives

Drawing primitives render shapes directly to a `BITMAP`. All colors are packed integers in `0xAARRGGBB` format — use `makecol(r, g, b)` to create them.

## Clearing

```ts
function clear_bitmap(bitmap: BITMAP | undefined): void;
function clear_to_color(bitmap: BITMAP | undefined, colour: number): void;
```

`clear_bitmap` fills with transparent black (`0x000000`). `clear_to_color` fills with an arbitrary color.

## Pixels

```ts
function putpixel(bmp: BITMAP | undefined, x: number, y: number, c: number): void;
function getpixel(bmp: BITMAP | undefined, x: number, y: number): number;
```

`getpixel` returns the packed color at `(x, y)`, or `-1` if out of bounds.

::: warning Performance
`getpixel` and `putpixel` are slow — they call `getImageData`/`fillRect` per pixel. Avoid them inside tight loops.
:::

Fast variants (`_putpixel`, `_putpixel32`, `_getpixel`, `_getpixel32`, etc.) are aliases and have the same performance characteristics in the browser.

## Lines

```ts
function vline(bitmap: BITMAP | undefined, x: number, y1: number, y2: number, colour: number): void;
function hline(bitmap: BITMAP | undefined, x1: number, y: number, x2: number, colour: number): void;
function line(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: number,
): void;
function fastline(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: number,
): void;
```

`fastline` is an alias for `line`.

### do_line

```ts
function do_line(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  d: number,
  proc: (bmp: BITMAP, x: number, y: number, d: number) => void,
): void;
```

Iterates over each pixel along the line, calling `proc` for each one. Useful with `putpixel`.

## Rectangles

```ts
function rect(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: number,
): void;
function rectfill(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: number,
): void;
```

`rect` draws an outline; `rectfill` draws a filled rectangle.

## Triangles & Polygons

```ts
function triangle(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  colour: number,
): void;
function polygon(
  bitmap: BITMAP | undefined,
  vertices: number,
  points: number[],
  colour: number,
): void;
```

`polygon` accepts `vertices` points packed as `[x0, y0, x1, y1, ...]` in the `points` array. Both draw filled shapes.

## Circles & Ellipses

```ts
function circle(
  bitmap: BITMAP | undefined,
  x: number,
  y: number,
  radius: number,
  colour: number,
): void;
function circlefill(
  bitmap: BITMAP | undefined,
  x: number,
  y: number,
  radius: number,
  colour: number,
): void;
function ellipse(
  bitmap: BITMAP | undefined,
  x: number,
  y: number,
  rx: number,
  ry: number,
  colour: number,
): void;
function ellipsefill(
  bitmap: BITMAP | undefined,
  x: number,
  y: number,
  rx: number,
  ry: number,
  colour: number,
): void;
```

### do_circle / do_ellipse

```ts
function do_circle(bmp, x, y, radius, d, proc): void;
function do_ellipse(bitmap, x, y, rx, ry, d, proc): void;
```

Iterate over outline pixels and call `proc` for each.

## Arcs

```ts
function arc(
  bitmap: BITMAP | undefined,
  x: number,
  y: number,
  ang1: number,
  ang2: number,
  r: number,
  colour: number,
): void;
function do_arc(bitmap, x, y, a1, a2, r, d, proc): void;
```

Angles are in Allegro fixed-point format: **256 = full circle**.

## Splines

```ts
function spline(bmp: BITMAP | undefined, points: number[], color: number): void;
```

Draws a smooth curve through 8 control points packed as `[x0, y0, x1, y1, x2, y2, x3, y3]`.

## Flood fill

```ts
function floodfill(bmp: BITMAP | undefined, x: number, y: number, color: number): void;
```

BFS flood-fill starting at `(x, y)`. Replaces all connected pixels of the same color with `color`.
