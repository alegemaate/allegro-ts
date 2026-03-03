# Sprites

Sprite functions copy one `BITMAP` onto another, with optional transforms. The source bitmap's transparent pixels (alpha = 0 or original magic-pink) are preserved.

## Blit

```ts
function blit(
  source: BITMAP | undefined,
  dest: BITMAP | undefined,
  source_x: number,
  source_y: number,
  dest_x: number,
  dest_y: number,
  width: number,
  height: number,
): void;
```

Copies a region from `source` to `dest`. Does not preserve transparency.

```ts
function stretch_blit(
  source,
  dest,
  source_x,
  source_y,
  source_w,
  source_h,
  dest_x,
  dest_y,
  dest_w,
  dest_h,
): void;
function masked_blit(sprite, dest, source_x, source_y, dest_x, dest_y, width, height): void;
function masked_stretch_blit(
  sprite,
  dest,
  source_x,
  source_y,
  source_w,
  source_h,
  dest_x,
  dest_y,
  dest_w,
  dest_h,
): void;
```

`masked_blit` and `masked_stretch_blit` are identical to their non-masked counterparts in truecolor mode (the browser always uses alpha channels).

## draw_sprite

```ts
function draw_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void;
function stretch_sprite(bmp, sprite, x, y, w, h): void;
```

Draws `sprite` at `(x, y)` on `bmp`. This is the fastest general-purpose drawing function.

## Flipping

```ts
function draw_sprite_v_flip(bmp, sprite, x, y): void; // horizontal mirror
function draw_sprite_h_flip(bmp, sprite, x, y): void; // vertical mirror
function draw_sprite_vh_flip(bmp, sprite, x, y): void; // both axes
```

::: info Naming note
The v/h naming follows the original Allegro 4 convention, which may seem reversed from what you'd expect. `v_flip` flips along the vertical axis (horizontal mirror image).
:::

## Lighting

```ts
function draw_lit_sprite(bmp, sprite, x, y, color: number): void;
```

Applies a white light overlay. `color` is `0–255` where `0` = no change, `255` = fully white.

## Transparency

```ts
function draw_trans_sprite(bmp, sprite, x, y): void; // alias for draw_sprite
function draw_gouraud_sprite(bmp, sprite, x, y, c1, c2, c3, c4): void; // stub
```

## Rotation

All rotation angles are in **Allegro fixed-point format: 256 = full circle**.

```ts
function rotate_sprite(bmp, sprite, x, y, angle: number): void;
function rotate_sprite_v_flip(bmp, sprite, x, y, angle: number): void;
```

Sprites are rotated around their **centre point**.

## Rotation + scale

```ts
function rotate_scaled_sprite(bmp, sprite, x, y, angle: number, scale: number): void;
function rotate_scaled_sprite_v_flip(bmp, sprite, x, y, angle: number, scale: number): void;
```

`scale` is a multiplier: `1.0` = original size, `2.0` = double, `0.5` = half.

## Pivot

Pivot functions rotate around an **arbitrary point** relative to the sprite's top-left corner.

```ts
function pivot_sprite(bmp, sprite, x, y, cx: number, cy: number, angle: number): void;
function pivot_sprite_v_flip(bmp, sprite, x, y, cx, cy, angle): void;
function pivot_scaled_sprite(bmp, sprite, x, y, cx, cy, angle, scale): void;
function pivot_scaled_sprite_v_flip(bmp, sprite, x, y, cx, cy, angle, scale): void;
```

The sprite is drawn so that pixel `(cx, cy)` lands at screen position `(x, y)`.

## Example

```ts
const ship = await load_bitmap("ship.png");

let angle = 0;

while (true) {
  clear_bitmap(screen);
  rotate_scaled_sprite(screen, ship, SCREEN_W / 2, SCREEN_H / 2, angle, 2.0);
  angle = (angle + 1) % 256;
  await rest(16);
}
```
